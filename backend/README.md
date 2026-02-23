# Temple Backend - Setup Guide

## 📋 Prerequisites

1. **Node.js** v14 or higher
2. **PostgreSQL** v12 or higher
3. **npm** or **yarn**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=temple_db
DB_USER=postgres
DB_PASSWORD=your_password

# Storage (use 'local' for development)
STORAGE_TYPE=local

# Email Configuration (use 'ethereal' for testing)
EMAIL_SERVICE=ethereal
EMAIL_FROM="Raja Rajeshwara Temple <noreply@temple.com>"
FRONTEND_URL=http://localhost:3000

# JWT Secret (generate a random string)
JWT_SECRET=your_secret_key_here
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE temple_db;

# Exit psql
\q
```

### 4. Run Database Schema

```bash
psql -U postgres -d temple_db -f database/schema.sql
```

###  5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:8080**

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── events.js           # Events CRUD
│   ├── services.js         # Services CRUD
│   ├── staff.js            # Staff CRUD
│   ├── boardMembers.js     # Board members CRUD
│   ├── timings.js          # Temple timings CRUD
│   ├── donors.js           # Donors CRUD
│   ├── priests.js          # Priests CRUD
│   ├── gallery.js          # Gallery (images/videos/youtube)
│   ├── newsletter.js       # Newsletter subscriptions
│   └── dailyPrayers.js     # Daily prayers CRUD
├── utils/
│   └── fileStorage.js      # File upload handler (local/S3)
├── uploads/                # Local file storage (git-ignored)
├── database/
│   └── schema.sql          # Database schema
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Environment template
├── server.js               # Main server file
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (with file upload)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Services
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

### Staff
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery/images` - Upload image
- `POST /api/gallery/videos` - Upload video
- `POST /api/gallery/youtube` - Add YouTube link
- `DELETE /api/gallery/images/:id`
- `DELETE /api/gallery/videos/:id`
- `DELETE /api/gallery/youtube/:id`

...and more (see routes folder)

## 📦 File Upload

### Local Development
- Files stored in `./uploads/` folder
- Accessed via: `http://localhost:8080/uploads/filename.jpg`

### Production (S3)
- Set `STORAGE_TYPE=s3` in `.env`
- Configure AWS credentials
- Files stored in S3 bucket

## 🧪 Testing

Test the API with:

```bash
# Health check
curl http://localhost:8080/api/health

# Get events
curl http://localhost:8080/api/events

# Test email configuration
curl -X POST http://localhost:8080/api/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**📧 Email Testing:** Check console for preview URL when using Ethereal service!

## 📧 Email Notifications

### Quick Setup (Testing Mode - Default)
No configuration needed! Emails are captured by Ethereal and preview URLs are shown in console.

### Production Email Services
See **EMAIL_SETUP_GUIDE.md** for detailed setup of:
- Gmail SMTP (free, up to 500/day)
- SendGrid (100 free/day, professional features)
- AWS SES (cheapest for high volume)

### Available Email Features
1. ✅ Event registration confirmations (automatic)
2. ✅ Newsletter welcome emails (automatic)
3. ✅ Custom alerts to all subscribers (admin action)
4. ✅ Test email endpoint for configuration verification

See **EMAIL_QUICK_START.md** for 5-minute setup guide.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check connection
psql -U postgres -d temple_db -c "SELECT 1;"
```

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Default Credentials

- **Username:** admin
- **Password:** admin123

**⚠️ Change these in production!**

## 🔐 Security Notes

1. Never commit `.env` file
2. Change default admin password
3. Use strong JWT_SECRET
4. Enable HTTPS in production
5. Implement rate limiting
6. Validate all inputs

## 📊 Database Management

### Backup Database
```bash
pg_dump -U postgres temple_db > backup.sql
```

### Restore Database
```bash
psql -U postgres temple_db < backup.sql
```

### Reset Database
```bash
psql -U postgres -d temple_db -f database/schema.sql
```

## 🚀 Deployment

### Option 1: Heroku
```bash
heroku create temple-backend
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### Option 2: AWS EC2
1. Launch EC2 instance
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure `.env`
5. Run with PM2: `pm2 start server.js`

### Option 3: DigitalOcean
1. Create droplet
2. Install dependencies
3. Configure Nginx reverse proxy
4. Use PM2 for process management

## 📞 Support

For issues or questions, refer to:
- Main README.md
- DATABASE_IMPLEMENTATION_PLAN.md
