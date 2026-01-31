# 📊 Temple Newsletter - Visual Flow Diagrams

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                   TEMPLE HOME PAGE                          │
│              (http://localhost:3000/home)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  NAVIGATION TO BOTTOM                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │         📧 Subscribe to Temple News                    ││
│  │   Receive weekly temple events every Sunday 2:00 AM    ││
│  │                                                        ││
│  │  Email Input: [example@temple.com              ]       ││
│  │  [✉️ Subscribe Now]                               ││
│  │                                                        ││
│  │  📋 What You'll Get:                                  ││
│  │  • 📅 Weekly temple events & schedules               ││
│  │  • 🎉 Festival announcements & celebrations          ││
│  │  • 🙏 Special rituals & prayers                       ││
│  │  • 📢 Important temple announcements                  ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            ↓
                   User Enters Email
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            VALID EMAIL        INVALID/EMPTY
                    ↓               ↓
            [API CALL]      ❌ "Enter valid email"
                    ↓
            Subscribe Success
                    ↓
    ┌───────────────────────────────────┐
    │ ✅ Successfully subscribed!        │
    │ You will receive temple news      │
    │ every Sunday at 2:00 AM          │
    │                                   │
    │ [Unsubscribe]                    │
    └───────────────────────────────────┘
                    ↓
         Subscribe Flow Complete
```

---

## 👨‍💼 Admin Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                                │
│            (http://localhost:3000/login)                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
                 Enter: admin / admin123
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      HOME PAGE                               │
│                                                              │
│  [Logo]  Home Events Services Staff ...  [📧 Newsletter]  ││
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
                Click "📧 Newsletter"
                            ↓
┌──────────────────────────────────────────────────────────────┐
│            SUBSCRIPTION ADMIN DASHBOARD                      │
│         (http://localhost:3000/subscriptions/admin)         │
├──────────────────────────────────────────────────────────────┤
│                   STATISTICS SECTION                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Total: 5   │  │  Active: 4  │  │ Unsub: 1    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├──────────────────────────────────────────────────────────────┤
│                  TEST EMAIL SECTION                          │
│  Email: [admin@temple.com                          ]         │
│  [Send Test]                                                 │
├──────────────────────────────────────────────────────────────┤
│              SUBSCRIBERS TABLE [Refresh]                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Email                 Status      Subscribed   Sent    ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ user1@temple.com      ACTIVE      Dec 1       Dec 1  ││
│  │ user2@temple.com      ACTIVE      Dec 1       Dec 1  ││
│  │ user3@temple.com      ACTIVE      Dec 1       Dec 1  ││
│  │ user4@temple.com      ACTIVE      Dec 1       Dec 1  ││
│  │ user5@temple.com      UNSUBSCRIBED Dec 1      Dec 1  ││
│  └─────────────────────────────────────────────────────────┘│
│  [← Previous]  Page 1  [Next →]                             │
└──────────────────────────────────────────────────────────────┘
                            ↓
                      Admin Can:
            • View statistics
            • Send test emails
            • Browse subscribers
            • Navigate pages
            • Refresh data
```

---

## 📧 Email Sending Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  SUNDAY 2:00 AM IST                          │
│              (Scheduled Job Triggers)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           Fetch Active Subscriptions from DB                │
│                                                              │
│  SELECT * FROM email_subscription                           │
│  WHERE is_active = true                                     │
│  Result: 4 active subscribers                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
         FOR EACH SUBSCRIBER: Get upcoming events
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            BUILD HTML EMAIL WITH EVENTS                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🏛️ Raja Rajeshwara Temple                          │  │
│  │  ────────────────────────────────────────────────  │  │
│  │  Dear John,                                         │  │
│  │                                                    │  │
│  │  Here are this week's temple events:             │  │
│  │                                                    │  │
│  │  📅 Monday: Morning Prayer - 6:00 AM             │  │
│  │  🎉 Wednesday: Hanuman Jayanti - 5:00 PM         │  │
│  │  🙏 Friday: Special Rituals - 7:00 PM            │  │
│  │  📢 Sunday: Grand Celebration - All Day          │  │
│  │                                                    │  │
│  │  📞 Contact: +91 98765 43210                      │  │
│  │                                                    │  │
│  │  [Click to Unsubscribe]                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
         SEND via Gmail SMTP (smtp.gmail.com:587)
                            ↓
                 ┌──────────┬──────────┐
                 ↓          ↓
            SUCCESS     FAILED
                 ↓          ↓
          Log Success   Log Error
          Update timestamp
```

---

## 🔄 State Flow Diagram

### SubscribeNewsletter Component States

```
                    INITIAL STATE
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                  ↓
    [No Email]                      [Has localStorage]
    (Empty form)                     (Show subscribed)
        ↓                                  ↓
    [User types email]              [User can unsubscribe]
        ↓                                  ↓
    [Click Subscribe]                [API Call]
        ↓                                  ↓
    [LOADING STATE]                  [LOADING STATE]
    (Button disabled)                (Button disabled)
        ↓                                  ↓
    ┌──────┴──────┐                  ┌──────┴──────┐
    ↓             ↓                  ↓             ↓
 SUCCESS      FAILURE           SUCCESS      FAILURE
    ↓             ↓                  ↓             ↓
 ✅ Show     ❌ Show            Clear LS     ❌ Show
 message    error              Clear form    error
    ↓             ↓                  ↓             ↓
 Show active  Try again        Show empty    Try again
 status                         form
```

---

## 🗄️ Database Schema Diagram

```
email_subscription
├─ id (Primary Key)
├─ email (Unique, Indexed)
├─ full_name
├─ phone
├─ preferences (JSON)
├─ is_active (Boolean, Indexed)
├─ subscribed_at (Timestamp)
├─ unsubscribed_at (Timestamp)
├─ created_at (Indexed)
└─ updated_at

            ↓ Foreign Key
            
subscription_log
├─ id (Primary Key)
├─ subscription_id (Indexed)
├─ action_type (Indexed)
│  ├─ SUBSCRIBE
│  ├─ UNSUBSCRIBE
│  ├─ EMAIL_SENT
│  └─ EMAIL_FAILED
├─ details (Text)
├─ email_subject
├─ error_message
└─ created_at (Indexed)
```

---

## 🔌 API Communication Flow

```
FRONTEND                           BACKEND
    ↓                                 ↓
[User Subscribes]
    ↓
[SubscribeNewsletter Component]
    ↓
[subscriptionAPI.subscribe()]
    ↓
POST /api/subscriptions/subscribe
├─ Content-Type: application/json
├─ Body: {"email": "user@example.com"}
└────────────────────────────────→ [NewsletterSubscriptionController]
                                        ↓
                                  [Validate Email]
                                        ↓
                                  [Save to DB]
                                        ↓
                                  [Log Action]
                                        ↓
                          Response: 200 OK
                          {"email": "...", "status": "ACTIVE"}
                  ←────────────────────────────────
    ↓
[Handle Response]
    ↓
[Show Success Message]
    ↓
[Save to localStorage]
    ↓
[Update UI State]
```

---

## 📱 Responsive Design Layout

### Desktop (>1024px)
```
┌────────────────────────────────────────────────┐
│  Logo    Home  Events  Services  [Newsletter]  │
├────────────────────────────────────────────────┤
│                                                │
│  HERO SECTION WITH LARGE TITLE                │
│                                                │
├────────────────────────────────────────────────┤
│  ABOUT SECTION WITH TABS                       │
├────────────────────────────────────────────────┤
│  SERVICES GRID                                 │
│  ┌─────────────┐ ┌─────────────┐             │
│  │   Service   │ │   Service   │             │
│  └─────────────┘ └─────────────┘             │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐ │
│  │  📧 Subscribe to Temple News             │ │
│  │  [Email Input]  [Subscribe Button]       │ │
│  │  📋 Features:                            │ │
│  │  • Weekly events    • Festivals          │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│ Logo  [≡ Menu]       │
├──────────────────────┤
│   HERO SECTION       │
│   (Smaller Text)     │
├──────────────────────┤
│  ABOUT (Vertical)    │
├──────────────────────┤
│  SERVICES (Stack)    │
│  ┌────────────────┐  │
│  │ Service 1      │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Service 2      │  │
│  └────────────────┘  │
├──────────────────────┤
│ 📧 NEWSLETTER        │
│ [Email Input]        │
│ [Subscribe]          │
│ 📋 Features:         │
│ • Weekly events      │
│ • Festivals          │
│ • Rituals            │
│ • Announcements      │
└──────────────────────┘
```

---

## 🎯 Component Tree

```
App.jsx
├── Navigation
│   └── Newsletter Link (Admin only)
├── Routes
│   ├── /home → UserHome
│   │   └── SubscribeNewsletter
│   │       └── subscriptionAPI
│   │
│   ├── /login → Login
│   │
│   └── /subscriptions/admin → SubscriptionAdmin (Protected)
│       └── subscriptionAPI
│
└── Footer
```

---

## ⏰ Timeline & Scheduling

```
┌─────────────────────────────────────────────────────┐
│  WEEKLY SCHEDULE (IST - Indian Standard Time)       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MON    TUE    WED    THU    FRI    SAT    SUN     │
│   │      │      │      │      │      │      │      │
│   │      │      │      │      │      │      │      │
│   │      │      │      │      │      │  ✉️  │      │
│   │      │      │      │      │      │  2AM │      │
│   │      │      │      │      │      │ Send │      │
│   │      │      │      │      │      │Email │      │
│   │      │      │      │      │      │  │   │      │
│   │      │      │      │      │      │  ↓   │      │
│   └──────┴──────┴──────┴──────┴──────┴──┬───┴──────│
│                                        │          │
│                                   Subscribers    │
│                                   receive in    │
│                                   inbox by     │
│                                   morning      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
USER REQUEST
    ↓
┌───────────────┐
│ FRONTEND      │
│ ┌───────────┐ │
│ │ Validate  │ │ Email regex check
│ │ Email     │ │ Format verification
│ └───────────┘ │
│       ↓        │
└───────┼────────┘
        ↓
    API CALL
    POST /subscribe
        ↓
┌──────────────────────────────┐
│ BACKEND                      │
│ ┌──────────────────────────┐ │
│ │ Re-validate Email        │ │ Server-side check
│ │ Check for duplicates     │ │ Prevent duplicates
│ │ Hash sensitive data      │ │ Security measure
│ │ Log action               │ │ Audit trail
│ └──────────────────────────┘ │
│       ↓                       │
│ ┌──────────────────────────┐ │
│ │ Save to Database         │ │ Encrypted storage
│ │ Create subscription_log  │ │ Activity tracking
│ └──────────────────────────┘ │
│       ↓                       │
│ Return Response              │
│ {"success": true}            │
│                              │
└──────────────────────────────┘
        ↓
    FRONTEND
    ┌──────────────┐
    │ Store email  │ localStorage only
    │ localStorage │ (not sensitive)
    │ Update UI    │
    └──────────────┘
```

---

## 📊 Data Flow Summary

```
         USER INPUT
             ↓
    ┌────────────────┐
    │ FRONTEND APP   │
    │ React Component│
    └────────────────┘
             ↓
    ┌────────────────┐
    │   VALIDATION   │
    │ Email format   │
    └────────────────┘
             ↓
    ┌────────────────┐
    │  API CALL      │
    │  HTTP Request  │
    │  JSON Body     │
    └────────────────┘
             ↓
    ┌────────────────┐
    │ SPRING BOOT    │
    │ Backend Server │
    └────────────────┘
             ↓
    ┌────────────────┐
    │ VALIDATION     │
    │ DB Check       │
    │ Security Check │
    └────────────────┘
             ↓
    ┌────────────────┐
    │ POSTGRESQL DB  │
    │ Store Data     │
    │ Log Activity   │
    └────────────────┘
             ↓
    ┌────────────────┐
    │ RESPONSE       │
    │ JSON Success   │
    └────────────────┘
             ↓
    ┌────────────────┐
    │ UPDATE UI      │
    │ Show Message   │
    │ Save to Cache  │
    └────────────────┘
```

---

## ✨ Feature Highlights Map

```
┌─ FRONTEND FEATURES ──────────────────────┐
│ ✅ Email validation (regex)              │
│ ✅ Error messages                        │
│ ✅ Success confirmation                  │
│ ✅ Loading states                        │
│ ✅ localStorage persistence              │
│ ✅ Responsive design                     │
│ ✅ Dark mode support                     │
│ ✅ Smooth animations                     │
└──────────────────────────────────────────┘

┌─ BACKEND FEATURES ───────────────────────┐
│ ✅ Server-side validation                │
│ ✅ Database storage                      │
│ ✅ Activity logging                      │
│ ✅ Email sending (SMTP)                  │
│ ✅ Scheduled jobs (weekly)               │
│ ✅ Admin endpoints                       │
│ ✅ Error handling                        │
│ ✅ CORS security                         │
└──────────────────────────────────────────┘

┌─ USER BENEFITS ──────────────────────────┐
│ 📧 Weekly newsletters                    │
│ 📅 Stay updated on events                │
│ 🎉 Never miss festivals                  │
│ 🙏 Spiritual updates                     │
│ 📢 Important news first                  │
│ ✋ Easy unsubscribe                      │
│ 🔒 Privacy protected                     │
└──────────────────────────────────────────┘
```

---

**Last Updated:** December 2, 2025  
**Status:** ✅ Production Ready  
**Diagrams:** Complete Visual Flow Guide
