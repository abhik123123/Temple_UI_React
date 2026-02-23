const express = require('express');
const router = express.Router();

// Temporary in-memory storage (until database is set up)
let subscribers = [];

router.get('/', async (req, res) => {
  try {
    res.json(subscribers.filter(s => s.subscribed));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if already subscribed
    const existing = subscribers.find(s => s.email === email);
    
    if (existing && existing.subscribed) {
      return res.status(200).json({ 
        success: true,
        message: 'Already subscribed', 
        alreadyExists: true,
        email: email
      });
    }
    
    // Add or update subscription
    if (existing) {
      existing.subscribed = true;
      existing.subscription_date = new Date().toISOString();
    } else {
      subscribers.push({
        id: Date.now(),
        email: email,
        subscribed: true,
        subscription_date: new Date().toISOString()
      });
    }
    
    // Send welcome email (optional - will work when email service is configured)
    try {
      const { sendWelcomeEmail } = require('../utils/emailService');
      await sendWelcomeEmail(email);
      console.log('✓ Welcome email sent to:', email);
    } catch (emailError) {
      console.log('Note: Email service not configured, skipping welcome email');
      // Don't fail the subscription if email fails
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Subscribed successfully', 
      email: email
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe', details: error.message });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscriber = subscribers.find(s => s.email === email);
    if (subscriber) {
      subscriber.subscribed = false;
    }
    
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router;
