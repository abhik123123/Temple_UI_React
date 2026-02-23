const nodemailer = require('nodemailer');

// Email configuration based on environment
const getEmailTransporter = async () => {
  const emailService = process.env.EMAIL_SERVICE || 'ethereal';
  
  if (emailService === 'ethereal') {
    // Use configured Ethereal credentials or create new test account
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      // Use provided Ethereal credentials
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      // Auto-generate test account (fallback)
      const testAccount = await nodemailer.createTestAccount();
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
  }
  
  if (emailService === 'gmail') {
    // Gmail SMTP
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
      }
    });
  }
  
  if (emailService === 'sendgrid') {
    // SendGrid SMTP
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  if (emailService === 'aws-ses') {
    // AWS SES
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    
    return nodemailer.createTransport({
      SES: new AWS.SES({ apiVersion: '2010-12-01' })
    });
  }
  
  // Default: Ethereal
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Temple Admin" <noreply@temple.com>',
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✓ Email sent:', info.messageId);
    
    // For Ethereal, get preview URL
    if (process.env.EMAIL_SERVICE === 'ethereal' || !process.env.EMAIL_SERVICE) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};

/**
 * Send event registration confirmation
 */
const sendEventRegistrationEmail = async (eventDetails, userDetails) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .event-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E6B325; }
        .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 30px; background: #E6B325; color: #0B1C3F; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕉️ Event Registration Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear ${userDetails.name},</p>
          <p>Thank you for registering for our upcoming event!</p>
          
          <div class="event-details">
            <h2>${eventDetails.title}</h2>
            <p><strong>📅 Date:</strong> ${eventDetails.date}</p>
            <p><strong>⏰ Time:</strong> ${eventDetails.time}</p>
            <p><strong>📍 Location:</strong> ${eventDetails.location}</p>
            <p><strong>📝 Description:</strong> ${eventDetails.description}</p>
          </div>
          
          <p>We look forward to seeing you at the event!</p>
          
          <p>If you have any questions, please feel free to contact us.</p>
          
          <p>Regards,<br><strong>Raja Rajeshwara Temple</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© 2026 Raja Rajeshwara Temple. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: userDetails.email,
    subject: `Event Registration Confirmed - ${eventDetails.title}`,
    html,
    text: `Event Registration Confirmed\n\nEvent: ${eventDetails.title}\nDate: ${eventDetails.date}\nTime: ${eventDetails.time}\nLocation: ${eventDetails.location}`
  });
};

/**
 * Send newsletter
 */
const sendNewsletterEmail = async (email, content) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; }
        .unsubscribe { color: #999; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕉️ Temple Newsletter</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© 2026 Raja Rajeshwara Temple. All rights reserved.</p>
          <div class="unsubscribe">
            <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}">Unsubscribe from newsletter</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: email,
    subject: 'Raja Rajeshwara Temple Newsletter',
    html
  });
};

/**
 * Send welcome email to new subscribers
 */
const sendWelcomeEmail = async (email) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🙏 Welcome to Our Temple Community!</h1>
        </div>
        <div class="content">
          <p>Dear Devotee,</p>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You will now receive:</p>
          <ul>
            <li>📅 Upcoming events and celebrations</li>
            <li>🕉️ Daily prayer schedules</li>
            <li>📖 Spiritual teachings and insights</li>
            <li>📸 Temple updates and gallery</li>
          </ul>
          <p>May the divine blessings be with you always!</p>
          <p>Om Shanti,<br><strong>Raja Rajeshwara Temple</strong></p>
        </div>
        <div class="footer">
          <p>© 2026 Raja Rajeshwara Temple. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: email,
    subject: 'Welcome to Raja Rajeshwara Temple Community!',
    html
  });
};

/**
 * Send custom alert to all subscribers
 */
const sendAlertToSubscribers = async (subject, message, subscribers) => {
  const results = {
    success: [],
    failed: []
  };
  
  for (const subscriber of subscribers) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 Temple Alert</h1>
            </div>
            <div class="content">
              <div class="alert">
                <h2>${subject}</h2>
                <p>${message}</p>
              </div>
              <p>Regards,<br><strong>Raja Rajeshwara Temple</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 Raja Rajeshwara Temple. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await sendEmail({
        to: subscriber.email,
        subject: `Temple Alert: ${subject}`,
        html
      });
      
      results.success.push(subscriber.email);
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error.message);
      results.failed.push(subscriber.email);
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendEventRegistrationEmail,
  sendNewsletterEmail,
  sendWelcomeEmail,
  sendAlertToSubscribers
};
