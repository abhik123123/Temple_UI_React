# ✅ Ethereal Email Account Configured

## 🔐 Your Credentials

**Account Name:** Adalberto D'Amore  
**Email:** adalberto.damore@ethereal.email  
**Password:** GjzR9aCwn9pDhRTynS

## 📧 Access Your Inbox

**Web Interface:** https://ethereal.email/login

Login with your credentials above to view all sent emails!

## ✅ Configuration Complete

Your Ethereal account is now configured in `backend/.env`:

```env
EMAIL_SERVICE=ethereal
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=adalberto.damore@ethereal.email
EMAIL_PASSWORD=GjzR9aCwn9pDhRTynS
EMAIL_FROM="Raja Rajeshwara Temple <adalberto.damore@ethereal.email>"
```

## 🧪 Test Your Email Setup

### 1. Start Backend Server
```bash
cd backend
npm install nodemailer
npm run dev
```

### 2. Send Test Email

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/notifications/test-email ^
  -H "Content-Type: application/json" ^
  -d "{\"to\":\"test@example.com\"}"
```

**Using Postman/Thunder Client:**
```
POST http://localhost:8080/api/notifications/test-email
Content-Type: application/json

{
  "to": "test@example.com"
}
```

### 3. View Sent Email

**Option 1:** Check console for preview URL
```
✓ Email sent: <xxx@ethereal.email>
📧 Preview URL: https://ethereal.email/message/xxxxx
```

**Option 2:** Login to Ethereal web interface
1. Go to: https://ethereal.email/login
2. Enter: adalberto.damore@ethereal.email
3. Password: GjzR9aCwn9pDhRTynS
4. View all sent emails in your inbox!

## 🎯 Test All Email Features

### Test 1: Newsletter Subscription
```bash
curl -X POST http://localhost:8080/api/newsletter/subscribe ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"subscriber@test.com\"}"
```
✅ Should send welcome email

### Test 2: Event Registration (if event exists)
```bash
curl -X POST http://localhost:8080/api/events/1/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@test.com\",\"phone\":\"1234567890\",\"numberOfPeople\":2}"
```
✅ Should send confirmation email

### Test 3: Send Alert to All Subscribers
```bash
curl -X POST http://localhost:8080/api/notifications/send-alert ^
  -H "Content-Type: application/json" ^
  -d "{\"subject\":\"Test Alert\",\"message\":\"This is a test notification.\"}"
```
✅ Should send alert to all subscribers

## 📊 Benefits of Using Your Ethereal Account

✅ **Persistent Inbox** - All emails in one place  
✅ **Web Access** - View emails in browser  
✅ **No Expiration** - Account doesn't expire  
✅ **Multiple Devices** - Access from anywhere  
✅ **Email History** - See all past test emails  
✅ **IMAP/POP3** - Use with email clients  

## 🔄 Switching to Production Email Later

When ready for production, update `backend/.env`:

### Gmail
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-temple@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Raja Rajeshwara Temple <your-temple@gmail.com>"
```

### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM="Raja Rajeshwara Temple <verified@yourdomain.com>"
```

### AWS SES
```env
EMAIL_SERVICE=aws-ses
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
EMAIL_FROM="Raja Rajeshwara Temple <verified@yourdomain.com>"
```

## 📱 IMAP/POP3 Access (Optional)

Configure your email client with:

**IMAP:**
- Host: imap.ethereal.email
- Port: 993
- Security: TLS
- Username: adalberto.damore@ethereal.email
- Password: GjzR9aCwn9pDhRTynS

**POP3:**
- Host: pop3.ethereal.email
- Port: 995
- Security: TLS
- Username: adalberto.damore@ethereal.email
- Password: GjzR9aCwn9pDhRTynS

## ⚠️ Important Notes

- This is a TEST account - emails are NOT delivered to real inboxes
- All sent emails are captured and viewable at ethereal.email
- Perfect for development and testing
- Switch to production email service before going live

---

**Status:** ✅ Ethereal account configured and ready to use!

**Next Step:** Run `npm run dev` in backend folder and test!
