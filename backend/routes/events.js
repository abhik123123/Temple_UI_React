const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');
const { sendEventRegistrationEmail } = require('../utils/emailService');

// GET all events
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM events ORDER BY event_date DESC'
    );
    
    // Convert image URLs to full URLs for frontend
    const events = result.rows.map(event => ({
      ...event,
      imageUrl: event.image_url ? `${req.protocol}://${req.get('host')}${event.image_url}` : null
    }));
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = result.rows[0];
    event.imageUrl = event.image_url ? `${req.protocol}://${req.get('host')}${event.image_url}` : null;
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST create new event (with image upload)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      eventDate,
      startTime,
      endTime,
      location,
      description,
      category
    } = req.body;
    
    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }
    
    const result = await db.query(
      `INSERT INTO events (title, event_date, start_time, end_time, location, description, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, eventDate, startTime, endTime, location, description, category, imageUrl]
    );
    
    const event = result.rows[0];
    event.imageUrl = event.image_url ? `${req.protocol}://${req.get('host')}${event.image_url}` : null;
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT update event
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      eventDate,
      startTime,
      endTime,
      location,
      description,
      category
    } = req.body;
    
    // Check if event exists
    const existingEvent = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (existingEvent.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Handle image upload
    let imageUrl = existingEvent.rows[0].image_url;
    if (req.file) {
      // Delete old image if exists
      if (imageUrl) {
        await deleteFile(imageUrl);
      }
      imageUrl = await uploadFile(req.file);
    }
    
    const result = await db.query(
      `UPDATE events 
       SET title = $1, event_date = $2, start_time = $3, end_time = $4, 
           location = $5, description = $6, category = $7, image_url = $8
       WHERE id = $9
       RETURNING *`,
      [title, eventDate, startTime, endTime, location, description, category, imageUrl, id]
    );
    
    const event = result.rows[0];
    event.imageUrl = event.image_url ? `${req.protocol}://${req.get('host')}${event.image_url}` : null;
    
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get event to delete associated image
    const event = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Delete image if exists
    if (event.rows[0].image_url) {
      await deleteFile(event.rows[0].image_url);
    }
    
    // Delete event
    await db.query('DELETE FROM events WHERE id = $1', [id]);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

/**
 * POST /api/events/:id/register
 * Register for an event and send confirmation email
 */
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, numberOfPeople } = req.body;
    
    // Get event details
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = eventResult.rows[0];
    
    // Insert registration
    const registrationResult = await db.query(
      `INSERT INTO event_registrations (event_id, name, email, phone, number_of_people)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, name, email, phone, numberOfPeople]
    );
    
    // Send confirmation email
    try {
      await sendEventRegistrationEmail(
        {
          title: event.title,
          date: new Date(event.event_date).toLocaleDateString(),
          time: event.start_time,
          location: event.location,
          description: event.description
        },
        {
          name,
          email
        }
      );
      console.log('✓ Registration confirmation email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError.message);
      // Don't fail the registration if email fails
    }
    
    res.status(201).json({
      message: 'Registration successful',
      registration: registrationResult.rows[0]
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

/**
 * POST /api/events/register
 * Register for an event with family members (in-memory storage until DB is set up)
 */
let registrations = [];

router.post('/register', async (req, res) => {
  try {
    const { eventId, familyGotram, members, createdAt } = req.body;
    
    if (!eventId || !members || members.length === 0) {
      return res.status(400).json({ error: 'Event ID and at least one family member required' });
    }
    
    // Get primary member for email
    const primaryMember = members.find(m => m.relation === 'Self') || members[0];
    
    if (!primaryMember.email) {
      return res.status(400).json({ error: 'Primary member email is required' });
    }
    
    // Try to fetch actual event details from database
    let eventDetails = {
      title: `Event ${eventId}`,
      date: new Date().toLocaleDateString(),
      time: 'To be confirmed',
      location: 'Raja Rajeshwara Temple',
      description: `Family registration with ${members.length} member(s)`
    };
    
    try {
      const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
      if (eventResult.rows.length > 0) {
        const event = eventResult.rows[0];
        eventDetails = {
          title: event.title,
          date: new Date(event.event_date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: event.start_time && event.end_time 
            ? `${event.start_time} - ${event.end_time}`
            : event.start_time || 'To be confirmed',
          location: event.location || 'Raja Rajeshwara Temple',
          description: event.description || `Family registration with ${members.length} member(s)`
        };
      }
    } catch (dbError) {
      console.warn('Could not fetch event details from database:', dbError.message);
      // Continue with default values
    }
    
    // Store registration in memory
    const registration = {
      id: Date.now().toString(),
      eventId,
      familyGotram,
      members,
      createdAt: createdAt || new Date().toISOString()
    };
    registrations.push(registration);
    
    // Send confirmation email to primary member
    try {
      await sendEventRegistrationEmail(
        eventDetails,
        {
          name: `${primaryMember.name} ${primaryMember.surname}`,
          email: primaryMember.email
        }
      );
      console.log('✓ Registration confirmation email sent to:', primaryMember.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError.message);
      // Don't fail the registration if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Confirmation email sent.',
      registration
    });
  } catch (error) {
    console.error('Error in event registration:', error);
    res.status(500).json({ error: 'Failed to register for event', details: error.message });
  }
});

module.exports = router;
