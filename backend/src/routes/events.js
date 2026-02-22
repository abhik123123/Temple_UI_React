const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, startTime, endTime, location, category, status, imageUrl } = req.body;
    if (!title || !eventDate) return res.status(400).json({ error: 'title and eventDate are required' });

    const result = await pool.query(
      `INSERT INTO events (title, description, event_date, start_time, end_time, location, category, status, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, description || '', eventDate, startTime || null, endTime || null, location || '', category || 'General', status || 'Upcoming', imageUrl || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, eventDate, startTime, endTime, location, category, status, imageUrl } = req.body;
    const result = await pool.query(
      `UPDATE events SET title=$1, description=$2, event_date=$3, start_time=$4, end_time=$5,
       location=$6, category=$7, status=$8, image_url=$9, updated_at=CURRENT_TIMESTAMP
       WHERE id=$10 RETURNING *`,
      [title, description, eventDate, startTime, endTime, location, category, status, imageUrl, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
