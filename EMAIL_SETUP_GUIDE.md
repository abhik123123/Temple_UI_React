# Email Notification Setup Guide

## Overview
The Temple application now supports sending email notifications to users for:
- 📧 Newsletter subscriptions (welcome emails)
- 🎉 Event registrations (confirmation emails)
- 📢 Custom alerts to all subscribers
- 🧪 Test email configuration

## Email Services Supported

### 1. **Ethereal Email** (Testing/Development) - RECOMMENDED FOR TESTING
- ✅ **FREE** - No signup required
- ✅ Automatically creates test accounts
- ✅ Provides preview URLs to view sent emails
- ✅ Perfect for development and testing
- ⚠️ Emails are NOT delivered to real inboxes

**Configuration:**
```env
EMAIL_SERVICE=ethereal
EMAIL_FROM="Raja Rajeshwara Temple <noreply@temple.com>"
```

### 2. **Gmail SMTP** (Small Scale)
- ✅ FREE for up to 500 emails/day
- ⚠️ Requires App Password setup
- ⚠️ May be blocked for bulk emails

**Setup Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an "App Password" for "Mail"
4. Use this password (NOT your regular password)

**Configuration:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Raja Rajeshwara Temple <your-email@gmail.com>"
```

### 3. **SendGrid** (Production Scale)
- ✅ FREE tier: 100 emails/day forever
- ✅ Paid: Starting at $15/month for 40,000 emails
- ✅ Professional email delivery with analytics

**Setup Steps:**
1. Sign up at: https://sendgrid.com
2. Verify your sender identity (email or domain)
3. Create an API Key: Settings → API Keys → Create API Key

**Configuration:**
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Raja Rajeshwara Temple <verified@yourdomain.com>"
```

### 4. **AWS SES** (Enterprise Scale)
- ✅ Very cheap: $0.10 per 1,000 emails
- ✅ High deliverability
- ⚠️ Requires domain verification
- ⚠️ Starts in "sandbox mode" (limited)

**Configuration:**
```env
EMAIL_SERVICE=aws-ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
EMAIL_FROM="Raja Rajeshwara Temple <noreply@yourdomain.com>"
```

---

## Installation Steps

### 1. Install Required Package
```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment Variables

Edit `backend/.env`:
```env
# For Testing (Default - No Setup Required)
EMAIL_SERVICE=ethereal
EMAIL_FROM="Raja Rajeshwara Temple <noreply@temple.com>"
FRONTEND_URL=http://localhost:3000

# OR for Gmail (after setting up App Password)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# EMAIL_FROM="Raja Rajeshwara Temple <your-email@gmail.com>"
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

---

## Testing Email Configuration

### Method 1: Using API (Postman/Thunder Client)

**Test Email Endpoint:**
```
POST http://localhost:8080/api/notifications/test-email
Content-Type: application/json

{
  "to": "test@example.com"
}
```

**Response (Ethereal):**
```json
{
  "message": "Test email sent successfully",
  "messageId": "<xxx@ethereal.email>",
  "previewUrl": "https://ethereal.email/message/xxxxx"
}
```

Click the `previewUrl` to view the email!

### Method 2: Using Frontend (Coming Soon)
The admin dashboard will have a "Test Email" button.

---

## API Endpoints

### 1. Test Email Configuration
```http
POST /api/notifications/test-email
Content-Type: application/json

{
  "to": "recipient@example.com"
}
```

### 2. Send Alert to All Subscribers
```http
POST /api/notifications/send-alert
Content-Type: application/json

{
  "subject": "Temple Closure Notice",
  "message": "The temple will be closed tomorrow for annual maintenance. We apologize for any inconvenience."
}
```

**Response:**
```json
{
  "message": "Alert sent",
  "totalSubscribers": 150,
  "successCount": 148,
  "failedCount": 2,
  "success": ["user1@email.com", "user2@email.com", ...],
  "failed": ["invalid@email.com", "bounced@email.com"]
}
```

### 3. Event Registration (Automatic Email)
```http
POST /api/events/:id/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "numberOfPeople": 2
}
```
✓ Automatically sends confirmation email to registrant

### 4. Newsletter Subscription (Automatic Email)
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```
✓ Automatically sends welcome email to new subscriber

---

## Email Templates

### 1. Event Registration Confirmation
- **Trigger:** User registers for an event
- **Contains:** Event details, date, time, location
- **Template:** Professional design with temple branding

### 2. Newsletter Welcome Email
- **Trigger:** New newsletter subscription
- **Contains:** Welcome message, what to expect
- **Template:** Friendly introduction with temple logo

### 3. Custom Alert
- **Trigger:** Admin sends alert from dashboard
- **Contains:** Custom subject and message
- **Template:** Alert-styled with yellow accent

### 4. Newsletter Campaign
- **Trigger:** Admin sends newsletter
- **Contains:** Custom HTML content
- **Template:** Newsletter layout with unsubscribe link

---

## Development Workflow

### Using Ethereal (Recommended for Development)

1. **No setup required** - just start the server
2. When an email is sent, check the console:
   ```
   ✓ Email sent: <xxx@ethereal.email>
   📧 Preview URL: https://ethereal.email/message/xxxxx
   ```
3. Click the preview URL to view the email in browser
4. All emails are captured for testing, not sent to real inboxes

**Advantages:**
- ✅ No account creation needed
- ✅ Instant testing
- ✅ No rate limits
- ✅ View all sent emails in one place
- ✅ Perfect for development

---

## Production Setup

### Option 1: Gmail (Quick Start)
**Best for:** Small temple, <500 emails/day

1. Set up App Password (see Gmail section above)
2. Update `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-temple-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
3. Test with: POST /api/notifications/test-email

### Option 2: SendGrid (Professional)
**Best for:** Growing temple, thousands of subscribers

1. Sign up at sendgrid.com (FREE tier available)
2. Verify sender email/domain
3. Create API key
4. Update `.env`:
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxxxx
   ```

### Option 3: AWS SES (Enterprise)
**Best for:** Large scale, lowest cost

1. Set up AWS account
2. Verify domain in SES
3. Request production access (removes sandbox limits)
4. Create IAM credentials
5. Update `.env`:
   ```env
   EMAIL_SERVICE=aws-ses
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   AWS_REGION=us-east-1
   ```

---

## Cost Comparison

| Service | Free Tier | Paid Tier | Best For |
|---------|-----------|-----------|----------|
| **Ethereal** | ∞ (testing only) | N/A | Development/Testing |
| **Gmail** | 500/day | N/A | Small scale (<500/day) |
| **SendGrid** | 100/day forever | $15/mo (40K emails) | Professional use |
| **AWS SES** | 62K/month (if on EC2) | $0.10/1000 emails | Enterprise scale |

---

## Troubleshooting

### Email not sending with Gmail
**Problem:** "Invalid credentials" error

**Solutions:**
1. ✓ Enable 2-Factor Authentication
2. ✓ Use App Password, NOT regular password
3. ✓ Check EMAIL_SERVICE=gmail in .env
4. ✓ Ensure EMAIL_USER and EMAIL_PASSWORD are correct

### Preview URL not showing with Ethereal
**Solution:** Check console logs for the URL, it's printed when email is sent

### SendGrid "Sender not verified"
**Solution:** Verify your sender email in SendGrid dashboard

### AWS SES "Email address not verified"
**Solution:** 
1. Verify email/domain in AWS SES console
2. Request production access if still in sandbox mode

---

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use App Passwords** for Gmail, not your main password
3. **Rotate API Keys** regularly for SendGrid/AWS
4. **Verify sender identity** to prevent spoofing
5. **Rate limiting** - Already configured in backend
6. **HTTPS only** in production for email API calls

---

## Next Steps

1. ✅ Install nodemailer: `npm install nodemailer`
2. ✅ Configure .env with EMAIL_SERVICE=ethereal (for testing)
3. ✅ Start backend: `npm run dev`
4. ✅ Test email: `POST /api/notifications/test-email`
5. ✅ Check console for preview URL
6. ⏳ Create admin UI for sending alerts (optional)
7. ⏳ Switch to production email service (Gmail/SendGrid/SES)

---

## Support

For issues:
1. Check console logs for error messages
2. Verify .env configuration
3. Test with Ethereal first before production service
4. Use preview URLs to debug email content

---

**Status:** ✅ Email service configured and ready to use!
**Default Mode:** Ethereal (testing) - No setup required
**Production Ready:** Switch EMAIL_SERVICE in .env when ready
