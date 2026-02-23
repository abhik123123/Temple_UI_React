# 📧 Email Notifications - Quick Start

## 🚀 5-Minute Setup (Testing)

### 1. Install Package
```bash
cd backend
npm install nodemailer
```

### 2. Configure .env
Add to `backend/.env`:
```env
EMAIL_SERVICE=ethereal
EMAIL_FROM="Raja Rajeshwara Temple <noreply@temple.com>"
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend
```bash
npm run dev
```

### 4. Test Email
Open browser/Postman and send:
```
POST http://localhost:8080/api/notifications/test-email
Content-Type: application/json

{
  "to": "test@example.com"
}
```

### 5. Check Console
Look for:
```
✓ Email sent: <xxx@ethereal.email>
📧 Preview URL: https://ethereal.email/message/xxxxx
```

**Click the preview URL to see the email!**

---

## 📱 What's Available

### Automatic Emails (No Action Needed)
1. **Event Registration Confirmation** ✅
   - Sent when users register for events
   - Contains event details, date, time, location

2. **Newsletter Welcome Email** ✅
   - Sent when users subscribe to newsletter
   - Welcome message with temple info

### Admin Features (Use NotificationAdmin Page)
1. **Send Alert to All Subscribers** 
   - Broadcast important announcements
   - Goes to all newsletter subscribers

2. **Test Email Configuration**
   - Verify email service is working
   - Get preview URL for testing

---

## 📂 Files Created

```
backend/
  ├── utils/emailService.js          ✅ Email sending logic
  ├── routes/notifications.js         ✅ Alert & test endpoints
  ├── routes/newsletter.js            ✅ Updated with welcome email
  └── routes/events.js                ✅ Updated with confirmation email

src/
  └── pages/NotificationAdmin.jsx     ✅ Admin UI for alerts

EMAIL_SETUP_GUIDE.md                  ✅ Complete documentation
EMAIL_QUICK_START.md                  ✅ This file
```

---

## 🎯 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notifications/test-email` | POST | Test email configuration |
| `/api/notifications/send-alert` | POST | Send alert to all subscribers |
| `/api/events/:id/register` | POST | Register + auto confirmation email |
| `/api/newsletter/subscribe` | POST | Subscribe + auto welcome email |

---

## 🧪 Testing Examples

### Test Email
```bash
curl -X POST http://localhost:8080/api/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com"}'
```

### Send Alert
```bash
curl -X POST http://localhost:8080/api/notifications/send-alert \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Temple Update",
    "message": "The temple will be open from 6 AM to 9 PM tomorrow."
  }'
```

### Event Registration (Auto Email)
```bash
curl -X POST http://localhost:8080/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "numberOfPeople": 2
  }'
```

### Newsletter Subscribe (Auto Email)
```bash
curl -X POST http://localhost:8080/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "subscriber@example.com"}'
```

---

## 🔄 Switching to Production Email

### Option 1: Gmail (Quick & Free)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-temple@gmail.com
EMAIL_PASSWORD=your-app-password
```
[Get App Password](https://myaccount.google.com/apppasswords)

### Option 2: SendGrid (Professional)
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```
[Sign up](https://sendgrid.com) - 100 free emails/day

### Option 3: AWS SES (Enterprise)
```env
EMAIL_SERVICE=aws-ses
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
```

---

## 📖 Full Documentation
See **EMAIL_SETUP_GUIDE.md** for:
- Detailed setup for each service
- Email templates
- Cost comparison
- Troubleshooting
- Security best practices

---

## ✅ Checklist

- [ ] Installed nodemailer: `npm install nodemailer`
- [ ] Added EMAIL_SERVICE to backend/.env
- [ ] Started backend server
- [ ] Tested with `/api/notifications/test-email`
- [ ] Got preview URL from console
- [ ] Viewed test email in browser
- [ ] (Optional) Added NotificationAdmin to Admin menu
- [ ] (Optional) Switched to production email service

---

## 🆘 Troubleshooting

**Q: Not seeing preview URL?**
A: Check backend console logs - URL is printed when email is sent

**Q: Gmail not working?**
A: Must use App Password, not regular password. Enable 2FA first.

**Q: Emails going to spam?**
A: In production, verify sender domain with your email service

**Q: Want to see email templates?**
A: Preview URLs show exact HTML sent to users

---

**Status:** ✅ Ready to use with Ethereal (testing mode)
**Next:** Add NotificationAdmin page to admin menu to send alerts!
