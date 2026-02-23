const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendAlertToSubscribers } = require('../utils/emailService');

/**
 * POST /api/notifications/send-alert
 * Send alert to all newsletter subscribers
 */
router.post('/send-alert', async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ 
        error: 'Subject and message are required' 
      });
    }
    
    // Get all active subscribers
    const result = await db.query(
      'SELECT email FROM newsletter_subscriptions WHERE subscribed = true'
    );
    
    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: 'No subscribers found',
        success: [],
        failed: []
      });
    }
    
    // Send emails
    const emailResults = await sendAlertToSubscribers(subject, message, result.rows);
    
    res.json({
      message: 'Alert sent',
      totalSubscribers: result.rows.length,
      successCount: emailResults.success.length,
      failedCount: emailResults.failed.length,
      success: emailResults.success,
      failed: emailResults.failed
    });
  } catch (error) {
    console.error('Send alert error:', error);
    res.status(500).json({ error: 'Failed to send alert' });
  }
});

/**
 * POST /api/notifications/test-email
 * Send test email (for configuration testing)
 */
router.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }
    
    const { sendEmail } = require('../utils/emailService');
    
    const result = await sendEmail({
      to,
      subject: 'Test Email from Temple Admin',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✓ Email Configuration Working!</h2>
          <p>This is a test email from your Temple application.</p>
          <p>If you received this, your email service is configured correctly.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: 'Email configuration is working! This is a test email.'
    });
    
    res.json({
      message: 'Test email sent successfully',
      messageId: result.messageId,
      previewUrl: result.previewUrl // For Ethereal testing
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

module.exports = router;
