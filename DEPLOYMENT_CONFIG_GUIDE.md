# Dual Database Configuration Guide

## Overview
Your Temple UI application now supports **two database configurations**:
- **Local PostgreSQL** for development (default)
- **AWS RDS** for production deployment

The application automatically switches between them based on the `NODE_ENV` variable.

---

## ✅ Current Setup

### Development (Local)
```env
NODE_ENV=development
DB_LOCAL_HOST=localhost
DB_LOCAL_PORT=5432
DB_LOCAL_USER=postgres
DB_LOCAL_PASSWORD=123456
DB_LOCAL_NAME=templedb
```

**Status**: ✅ Running and connected  
**Server**: http://localhost:8080  
**Command**: `cd backend && node server.js`

---

## 🚀 Production Setup (AWS RDS)

### Step 1: Create AWS RDS Database
1. Log in to AWS Console
2. Go to RDS → Create Database
3. Select **PostgreSQL**
4. Settings:
   - DB Instance ID: `templedb`
   - Master username: `postgres`
   - Master password: `Hanuman3339`
   - Instance class: `db.t3.micro` (free tier)
   - Storage: `20 GB`
   - Public accessible: **Yes**

### Step 2: Get AWS Endpoint
Once database is created:
1. Go to RDS → Databases → templedb
2. Copy the **Endpoint** (e.g., `templedb.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 3: Update .env for AWS
Edit `backend/.env` and replace:

```env
DB_AWS_HOST=templedb.xxxxx.us-east-1.rds.amazonaws.com
DB_AWS_PORT=5432
DB_AWS_USER=postgres
DB_AWS_PASSWORD=Hanuman3339
DB_AWS_NAME=templedb
DB_AWS_SSL=true
```

### Step 4: Deploy with AWS Configuration
When deploying to AWS, set environment variable:

```powershell
# Windows
set NODE_ENV=production
node server.js

# Linux/Mac
export NODE_ENV=production
node server.js
```

Or in your deployment platform (e.g., Heroku, AWS Elastic Beanstalk):
```
NODE_ENV=production
```

---

## 📋 Environment Variables Reference

### Development (.env)
```env
NODE_ENV=development

# Local PostgreSQL
DB_LOCAL_HOST=localhost
DB_LOCAL_PORT=5432
DB_LOCAL_USER=postgres
DB_LOCAL_PASSWORD=123456
DB_LOCAL_NAME=templedb
DB_LOCAL_SSL=false
```

### Production (.env)
```env
NODE_ENV=production

# AWS RDS PostgreSQL
DB_AWS_HOST=templedb.xxxxx.us-east-1.rds.amazonaws.com
DB_AWS_PORT=5432
DB_AWS_USER=postgres
DB_AWS_PASSWORD=Hanuman3339
DB_AWS_NAME=templedb
DB_AWS_SSL=true
```

---

## 🔄 How It Works

When backend starts, `config/database.js` checks `NODE_ENV`:

```
NODE_ENV=development?
    ↓ YES: Use Local PostgreSQL (localhost:5432)
    ↓ NO:  Use AWS RDS (AWS endpoint)
```

**Console Output Shows Active Database**:
```
💻 Using Local PostgreSQL configuration (DEVELOPMENT)
   or
🚀 Using AWS RDS configuration (PRODUCTION)
```

---

## ✅ Testing Each Configuration

### Test Local (Development)
```powershell
cd backend
node server.js
# Should show: "💻 Using Local PostgreSQL configuration"
```

### Test AWS (Production)
```powershell
cd backend
$env:NODE_ENV='production'
node server.js
# Should show: "🚀 Using AWS RDS configuration"
```

---

## 📊 Database Credentials Summary

| Config | Host | Port | User | Password |
|--------|------|------|------|----------|
| **Local** | localhost | 5432 | postgres | 123456 |
| **AWS** | templedb.xxxxx.us-east-1.rds.amazonaws.com | 5432 | postgres | Hanuman3339 |

---

## 🛠️ Troubleshooting

### Connection Error: "Cannot connect to localhost"
- Ensure local PostgreSQL is running
- Check pgAdmin: http://localhost:5050

### Connection Error: "Cannot connect to AWS RDS"
- Verify AWS endpoint is correct in `.env`
- Check AWS security group allows inbound port 5432
- Verify AWS credentials (user/password)

### Database "templedb" doesn't exist
Create it using:
```powershell
# Local
psql -U postgres -c "CREATE DATABASE templedb;"

# AWS
psql -h templedb.xxxxx.us-east-1.rds.amazonaws.com -U postgres -c "CREATE DATABASE templedb;"
```

### Import Schema
```powershell
# Local
psql -U postgres -d templedb -f backend/database/schema.sql

# AWS
psql -h templedb.xxxxx.us-east-1.rds.amazonaws.com -U postgres -d templedb -f backend/database/schema.sql
```

---

## 🚀 Deployment Checklist

- [ ] AWS RDS database created
- [ ] Endpoint copied to `.env` (DB_AWS_HOST)
- [ ] Schema imported to AWS database
- [ ] `.env` updated with AWS credentials
- [ ] `NODE_ENV=production` set in deployment
- [ ] Backend restarted
- [ ] Test API endpoint: `http://localhost:8080/api/health`

---

## 📝 Notes

- **Automatic Switching**: No code changes needed. Just set `NODE_ENV` environment variable
- **Both Configs Active**: Both local and AWS credentials remain in `.env`
- **Active Fallback**: If active configuration fails, manual switching required
- **SSL**: AWS uses SSL by default (rejectUnauthorized: false)
- **Local Development**: No SSL needed for localhost

---

## 🔗 Quick Commands

```powershell
# Development (Local)
cd backend
node server.js

# Production (AWS)
$env:NODE_ENV='production'
cd backend
node server.js

# Check which database is active
# Look at server startup message
```

---

## 📞 Support

When switching between configurations:
1. Update `.env` with correct credentials
2. Set `NODE_ENV` appropriately
3. Restart backend server
4. Check console for "Using Local" or "Using AWS" message

Done! ✅
