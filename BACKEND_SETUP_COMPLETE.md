# 🎯 Quick Start Guide - Temple App with Database

## ✅ What's Been Created

### Backend Files Created:
1. ✅ **Database Schema** (`backend/database/schema.sql`) - 14 tables
2. ✅ **Server** (`backend/server.js`) - Express server with all routes
3. ✅ **Database Config** (`backend/config/database.js`) - PostgreSQL connection
4. ✅ **File Storage** (`backend/utils/fileStorage.js`) - Local & S3 support
5. ✅ **10 Route Files** - All API endpoints ready
6. ✅ **Configuration** (`.env`, `.gitignore`, `README.md`)

### Key Features:
- 🖼️ **Images stored locally** in `backend/uploads/` folder (not base64!)
- 🔄 **Easy switch** between local and S3 storage
- 📊 **PostgreSQL database** for all data
- 🌐 **Full REST API** for all resources

---

## 🚀 Step-by-Step Local Setup

### Step 1: Install PostgreSQL (if not installed)

**Windows:**
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14
```

**Verify Installation:**
```powershell
psql --version
# Should show: psql (PostgreSQL) 14.x or higher
```

### Step 2: Create Database

```powershell
# Connect to PostgreSQL (password: postgres)
psql -U postgres

# In psql prompt:
CREATE DATABASE temple_db;
\q
```

### Step 3: Run Database Schema

```powershell
cd c:\Users\FDUSC00090\Temple-UI\backend

# Import schema
psql -U postgres -d temple_db -f database/schema.sql
```

You should see output like:
```
DROP TABLE
DROP TABLE
...
CREATE TABLE
CREATE TABLE
...
✓ 14 tables created!
```

### Step 4: Install Backend Dependencies

```powershell
cd c:\Users\FDUSC00090\Temple-UI\backend
npm install
```

### Step 5: Configure Environment

Edit `backend\.env` file (already created):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=temple_db
DB_USER=postgres
DB_PASSWORD=postgres    # Change to your PostgreSQL password

STORAGE_TYPE=local     # Use local file storage
PORT=8080
```

### Step 6: Start Backend Server

```powershell
cd c:\Users\FDUSC00090\Temple-UI\backend
npm run dev
```

You should see:
```
=================================
🕉️  Temple Backend Server
=================================
✓ Server running on port 8080
✓ Environment: development
✓ Storage: local
✓ API URL: http://localhost:8080/api
✓ Connected to PostgreSQL database
=================================
```

### Step 7: Test Backend API

Open browser or use curl:
```powershell
# Health check
curl http://localhost:8080/api/health

# Get events (empty initially)
curl http://localhost:8080/api/events

# Login
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🔄 Next: Update Frontend to Use Backend

### Current State:
- ❌ Frontend uses localStorage
- ❌ Data not shared across devices

### After Update:
- ✅ Frontend uses backend API
- ✅ Data stored in PostgreSQL
- ✅ Images in filesystem (not base64!)
- ✅ Same data on all devices

### What Needs to Change:
1. **`src/services/templeAPI.js`** - Replace localStorage with fetch() calls
2. **Image handling** - Upload files instead of base64
3. **API URL** - Point to http://localhost:8080/api

**Ready to proceed with frontend integration?**

---

## 📊 Database Tables Created

| Table | Purpose | Image Support |
|-------|---------|---------------|
| users | Authentication | - |
| events | Temple events | ✅ image_url |
| services | Spiritual services | ✅ image_url |
| staff | Staff information | ✅ profile_image_url |
| board_members | Board members | ✅ image_url |
| timings | Operating hours | - |
| donors | Donation records | - |
| priests | Priests info | ✅ image_url |
| gallery_images | Gallery photos | ✅ image_url |
| gallery_videos | Gallery videos | ✅ video_url |
| youtube_links | YouTube videos | - |
| newsletter_subscriptions | Subscribers | - |
| daily_prayers | Prayer schedule | - |
| event_registrations | Event signups | - |

---

## 🖼️ How Images Work Now

### Before (localStorage):
```javascript
// Image converted to base64 (huge string)
imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // 100KB+ string!
```

### After (Backend):
```javascript
// Image saved as file
imageUrl: "/uploads/1234567890-abc123.jpg"  // Just a path!
// Accessed via: http://localhost:8080/uploads/1234567890-abc123.jpg
```

**Benefits:**
- ✅ Much smaller database
- ✅ Faster performance
- ✅ Easy to backup/migrate
- ✅ Can use CDN later

---

## 🧪 Testing the Backend

### Test Events API:
```powershell
# Create event with image (using Postman or curl)
curl -X POST http://localhost:8080/api/events `
  -F "title=Diwali Celebration" `
  -F "eventDate=2026-11-15" `
  -F "startTime=18:00" `
  -F "location=Main Hall" `
  -F "description=Join us for Diwali" `
  -F "category=Festival" `
  -F "photo=@path/to/image.jpg"

# Get all events
curl http://localhost:8080/api/events
```

---

## 🐛 Troubleshooting

### PostgreSQL Not Running:
```powershell
net start postgresql-x64-14
```

### Database Connection Error:
- Check password in `.env` matches PostgreSQL password
- Verify database `temple_db` exists: `psql -U postgres -l`

### Port 8080 Already in Use:
```powershell
# Find process
netstat -ano | findstr :8080

# Kill process
taskkill /PID <process_id> /F
```

### Tables Not Created:
```powershell
# Re-run schema
psql -U postgres -d temple_db -f database/schema.sql
```

---

## 💰 Cost Summary

### Local Development:
- **Cost:** $0
- **Storage:** Your hard drive
- **Database:** Local PostgreSQL

### Production (AWS):
- **RDS PostgreSQL:** FREE for 12 months (db.t2.micro)
- **S3 Storage:** ~$0.50/month for 20GB images
- **After 12 months:** ~$18-28/month

### Alternative (Free Forever):
- **PlanetScale:** 5GB database FREE
- **Cloudinary:** 25GB images FREE

---

## ✅ Checklist

- [ ] PostgreSQL installed
- [ ] Database `temple_db` created
- [ ] Schema imported (14 tables)
- [ ] Backend dependencies installed
- [ ] `.env` configured
- [ ] Backend server running on port 8080
- [ ] Health check returns `{"status":"ok"}`
- [ ] Ready to update frontend!

---

## 🎯 Next Steps

1. ✅ Backend is ready!
2. ⏭️ Update frontend to use backend API
3. ⏭️ Migrate existing localStorage data (optional)
4. ⏭️ Test all features
5. ⏭️ Deploy to production

**Ready to proceed with frontend integration?** (This will take 2-3 hours of work)
