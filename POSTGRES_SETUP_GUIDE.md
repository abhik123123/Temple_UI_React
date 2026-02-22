# Temple PostgreSQL Setup Guide

## 🎯 Complete Setup in 3 Steps

### Step 1: Create PostgreSQL Database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE templedb;
```

Or using command line:
```bash
psql -U postgres
CREATE DATABASE templedb;
\q
```

### Step 2: Run Database Migration

This creates the `board_members` table and inserts sample data:

```bash
cd backend
npm run migrate
```

Expected output:
```
✅ Board members table created successfully!
✅ Sample data inserted successfully!
📊 Total board members in database: 6
✅ Migration completed successfully!
```

### Step 3: Start Both Servers

**Option A - Use the startup script:**
```bash
start-full-stack.bat
```

**Option B - Start manually:**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
npm start
```

## 🧪 Verify Installation

### 1. Check Backend is Running
Open browser: http://localhost:8080/health

Should see:
```json
{
  "status": "OK",
  "message": "Temple Backend API is running"
}
```

### 2. Check Board Members API
Open browser: http://localhost:8080/api/board-members

Should see array of 6 board members.

### 3. Check Frontend
Open browser: http://localhost:3000/board-members

Should display board members from PostgreSQL!

## 🔧 Database Configuration

Edit `backend/.env` if your PostgreSQL settings are different:

```env
DB_USER=postgres          # Your PostgreSQL username
DB_HOST=localhost         # Database host
DB_NAME=templedb          # Database name
DB_PASSWORD=admin123      # Your PostgreSQL password
DB_PORT=5432              # PostgreSQL port
PORT=8080                 # Backend server port
```

## 📊 Database Structure

Table: `board_members`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| full_name | VARCHAR(255) | Member's full name |
| position | VARCHAR(255) | Board position |
| department | VARCHAR(255) | Department name |
| email | VARCHAR(255) | Contact email |
| phone_number | VARCHAR(50) | Contact phone |
| biography | TEXT | Member biography |
| profile_image_url | TEXT | Image URL/path |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🚀 API Endpoints

All endpoints available at `http://localhost:8080/api/board-members`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all members |
| GET | `/:id` | Get member by ID |
| GET | `/department/:dept` | Get by department |
| POST | `/` | Create new member |
| PUT | `/:id` | Update member |
| DELETE | `/:id` | Delete member |

## 🎨 Using the Application

### View Board Members (Public)
1. Go to http://localhost:3000/board-members
2. Filter by department
3. Click on a member to see full details

### Manage Board Members (Admin)
1. Login at http://localhost:3000/login
   - Username: `admin`
   - Password: `admin123`
2. Go to http://localhost:3000/board-members/admin
3. Add, edit, or delete members
4. Changes are saved directly to PostgreSQL!

## 🔍 Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check credentials in `backend/.env`
- Verify database exists: `psql -U postgres -l`

### "Table doesn't exist" error
- Run migrations: `cd backend && npm run migrate`

### Backend won't start
- Check if port 8080 is already in use
- Change PORT in `backend/.env` if needed

### Frontend shows localStorage data
- Backend must be running on port 8080
- Check browser console for API errors
- Verify CORS settings in backend

## 🎯 What's Connected

```
Frontend (React - Port 3000)
    ↓
boardMembersAPI.js
    ↓
Backend (Express - Port 8080)
    ↓
PostgreSQL Database (Port 5432)
    ↓
board_members table
```

## ✅ Success Indicators

- ✅ Backend starts without errors
- ✅ Health check returns status OK
- ✅ API returns board members array
- ✅ Frontend loads members from database
- ✅ Admin can add/edit/delete members
- ✅ Changes persist after page refresh

## 📝 Next Steps

1. Customize member data
2. Add more departments
3. Upload real profile images
4. Extend to other entities (staff, events, etc.)

---

**Database:** PostgreSQL 14+  
**Backend:** Node.js 18+ with Express  
**Frontend:** React 18.3  
**Last Updated:** February 21, 2026
