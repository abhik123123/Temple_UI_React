# Temple Backend API - PostgreSQL

Node.js/Express backend with direct PostgreSQL database connection for Board Members management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE templedb;
```

### 3. Update Environment Variables
Edit `backend/.env` file:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=templedb
DB_PASSWORD=your_password
DB_PORT=5432
PORT=8080
```

### 4. Run Database Migrations
```bash
npm run migrate
```

This will:
- Create the `board_members` table
- Insert 6 sample board members
- Set up indexes

### 5. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will start on: **http://localhost:8080**

## 📡 API Endpoints

### Board Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/board-members` | Get all board members |
| GET | `/api/board-members/:id` | Get member by ID |
| GET | `/api/board-members/department/:dept` | Get members by department |
| POST | `/api/board-members` | Create new member |
| PUT | `/api/board-members/:id` | Update member |
| DELETE | `/api/board-members/:id` | Delete member |

### Example Requests

**Get All Members:**
```bash
curl http://localhost:8080/api/board-members
```

**Create Member:**
```bash
curl -X POST http://localhost:8080/api/board-members \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "position": "Member",
    "department": "Finance",
    "email": "john@temple.com",
    "phoneNumber": "9876543216",
    "biography": "Experienced financial advisor",
    "profileImageUrl": null
  }'
```

**Update Member:**
```bash
curl -X PUT http://localhost:8080/api/board-members/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rajesh Kumar Updated",
    "position": "President",
    "department": "Leadership",
    "email": "rajesh.kumar@temple.com",
    "phoneNumber": "9876543210",
    "biography": "Updated biography",
    "profileImageUrl": null
  }'
```

**Delete Member:**
```bash
curl -X DELETE http://localhost:8080/api/board-members/1
```

## 🗄️ Database Schema

```sql
CREATE TABLE board_members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    biography TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

Test the API with health check:
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Temple Backend API is running"
}
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data (future)

## 🔧 Troubleshooting

**Connection Refused:**
- Make sure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill process: `netstat -ano | findstr :8080`

**Migration Errors:**
- Drop and recreate database if needed
- Check PostgreSQL logs for details

## 🔐 Security Notes

For production:
1. Use strong passwords
2. Enable SSL for database connections
3. Add authentication middleware
4. Implement rate limiting
5. Validate all inputs
6. Use environment-specific configs

## 📚 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** PostgreSQL 14+
- **Driver:** node-postgres (pg)
- **Dev Tools:** nodemon

## 🤝 Integration with Frontend

The frontend (`http://localhost:3000`) automatically connects to this backend via:
- `src/services/boardMembersAPI.js`
- API calls use `http://localhost:8080/api/board-members`

Start both servers:
1. Backend: `cd backend && npm start` (port 8080)
2. Frontend: `cd .. && npm start` (port 3000)

Visit: http://localhost:3000/board-members
