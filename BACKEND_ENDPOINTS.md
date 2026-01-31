# Temple Backend API - Actual Endpoints Documentation

## 🌐 Base URLs
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:3000`

---

## 1. AUTHENTICATION ENDPOINTS
**Base URL:** `/auth`

### Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logout successful"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "username": "admin",
  "role": "ADMIN"
}
```

---

## 2. EVENTS ENDPOINTS
**Base URL:** `/events`

### Get All Events
```
GET /events

Response (200):
[
  {
    "id": 1,
    "eventName": "Diwali Festival",
    "description": "Celebrate the festival of lights",
    "eventDate": "2025-11-01",
    "startTime": "18:00:00",
    "endTime": "22:00:00",
    "location": "Main Hall",
    "category": "Festival",
    "status": "Upcoming",
    "imageUrl": null
  }
]
```

### Get Single Event
```
GET /events/{id}

Response (200):
{
  "id": 1,
  "eventName": "Diwali Festival",
  "description": "Celebrate the festival of lights",
  "eventDate": "2025-11-01",
  "startTime": "18:00:00",
  "endTime": "22:00:00",
  "location": "Main Hall",
  "category": "Festival",
  "status": "Upcoming",
  "imageUrl": null
}
```

### Create Event (Admin Only)
```
POST /events
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
  event: {
    "eventName": "New Event",
    "description": "Event description",
    "eventDate": "2025-12-25",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "location": "Temple Hall",
    "category": "Festival",
    "status": "Upcoming"
  }
  photo: [binary file]

Response (201):
{
  "id": 1,
  "eventName": "New Event",
  ...
}
```

### Update Event (Admin Only)
```
PUT /events/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data: (same as create)

Response (200):
{
  "id": 1,
  "eventName": "Updated Event",
  ...
}
```

### Delete Event (Admin Only)
```
DELETE /events/{id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Event deleted successfully"
}
```

---

## 3. SERVICES ENDPOINTS
**Base URL:** `/services`

### Get All Active Services
```
GET /services

Response (200):
[
  {
    "id": 1,
    "serviceName": "Puja Services",
    "description": "Daily puja and worship services",
    "price": 500,
    "category": "Religious",
    "isActive": true
  }
]
```

### Get Single Service
```
GET /services/{id}

Response (200):
{
  "id": 1,
  "serviceName": "Puja Services",
  "description": "Daily puja and worship services",
  "price": 500,
  "category": "Religious",
  "isActive": true
}
```

### Create Service
```
POST /services
Content-Type: application/json

Request Body:
{
  "serviceName": "Puja Services",
  "description": "Daily puja and worship services",
  "price": 500,
  "category": "Religious"
}

Response (201):
{
  "id": 1,
  ...
}
```

### Update Service
```
PUT /services/{id}
Content-Type: application/json

Request Body: (same as create)

Response (200):
{
  "id": 1,
  ...
}
```

### Delete Service
```
DELETE /services/{id}

Response (200):
{
  "message": "Service deleted successfully"
}
```

---

## 4. STAFF ENDPOINTS
**Base URL:** `/staff`

### Get All Staff
```
GET /staff

Response (200):
[
  {
    "id": 1,
    "staffName": "Rama Sharma",
    "position": "Head Priest",
    "department": "Religious",
    "phone": "9876543210",
    "email": "rama@temple.com"
  }
]
```

### Get Single Staff Member
```
GET /staff/{id}

Response (200):
{
  "id": 1,
  "staffName": "Rama Sharma",
  "position": "Head Priest",
  "department": "Religious",
  "phone": "9876543210",
  "email": "rama@temple.com"
}
```

### Get Staff by Department
```
GET /staff/department/{department}

Response (200):
[
  {
    "id": 1,
    "staffName": "Rama Sharma",
    "position": "Head Priest",
    "department": "Religious",
    "phone": "9876543210",
    "email": "rama@temple.com"
  }
]
```

### Create Staff Member
```
POST /staff
Content-Type: application/json

Request Body:
{
  "staffName": "Rama Sharma",
  "position": "Head Priest",
  "department": "Religious",
  "phone": "9876543210",
  "email": "rama@temple.com"
}

Response (201):
{
  "id": 1,
  ...
}
```

### Update Staff Member
```
PUT /staff/{id}
Content-Type: application/json

Request Body: (same as create)

Response (200):
{
  "id": 1,
  ...
}
```

### Delete Staff Member
```
DELETE /staff/{id}

Response (200):
{
  "message": "Staff member deleted successfully"
}
```

---

## 5. TIMINGS ENDPOINTS
**Base URL:** `/timings`

### Get All Timings
```
GET /timings

Response (200):
[
  {
    "id": 1,
    "dayOfWeek": "Monday",
    "openingTime": "06:00:00",
    "closingTime": "21:00:00"
  },
  {
    "id": 2,
    "dayOfWeek": "Tuesday",
    "openingTime": "06:00:00",
    "closingTime": "21:00:00"
  }
]
```

### Get Timing by ID
```
GET /timings/{id}

Response (200):
{
  "id": 1,
  "dayOfWeek": "Monday",
  "openingTime": "06:00:00",
  "closingTime": "21:00:00"
}
```

### Get Timings for Specific Day
```
GET /timings/day/{dayOfWeek}

Response (200):
{
  "id": 1,
  "dayOfWeek": "Monday",
  "openingTime": "06:00:00",
  "closingTime": "21:00:00"
}
```

### Create Timing
```
POST /timings
Content-Type: application/json

Request Body:
{
  "dayOfWeek": "Monday",
  "openingTime": "06:00:00",
  "closingTime": "21:00:00"
}

Response (201):
{
  "id": 1,
  ...
}
```

### Update Timing
```
PUT /timings/{id}
Content-Type: application/json

Request Body: (same as create)

Response (200):
{
  "id": 1,
  ...
}
```

### Delete Timing
```
DELETE /timings/{id}

Response (200):
{
  "message": "Timing deleted successfully"
}
```

---

## 6. DONORS ENDPOINTS
**Base URL:** `/donors`

### Get All Donors
```
GET /donors

Response (200):
[
  {
    "id": 1,
    "donorName": "Raj Kumar",
    "email": "raj@email.com",
    "phone": "9876543210",
    "donationAmount": 5000,
    "donationType": "Monthly",
    "donationDate": "2025-01-15"
  }
]
```

### Get Single Donor
```
GET /donors/{id}

Response (200):
{
  "id": 1,
  "donorName": "Raj Kumar",
  "email": "raj@email.com",
  "phone": "9876543210",
  "donationAmount": 5000,
  "donationType": "Monthly",
  "donationDate": "2025-01-15"
}
```

### Create Donor
```
POST /donors
Content-Type: application/json

Request Body:
{
  "donorName": "Raj Kumar",
  "email": "raj@email.com",
  "phone": "9876543210",
  "donationAmount": 5000,
  "donationType": "Monthly",
  "donationDate": "2025-01-15"
}

Response (201):
{
  "id": 1,
  ...
}
```

### Update Donor
```
PUT /donors/{id}
Content-Type: application/json

Request Body: (same as create)

Response (200):
{
  "id": 1,
  ...
}
```

### Delete Donor
```
DELETE /donors/{id}

Response (200):
{
  "message": "Donor deleted successfully"
}
```

## 7. PHOTOS ENDPOINTS
**Base URL:** `/api/photos`

### Upload Photo (Admin Only)
```
POST /api/photos/upload/{photoType}/{relatedId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Path Parameters:
  - photoType: EVENT, SERVICE, STAFF, etc.
  - relatedId: ID of the related entity

Form Data:
  - file: [binary image file]
  - description: "Photo description"

Response (201):
{
  "id": 1,
  "fileName": "photo_12345.jpg",
  "photoType": "EVENT",
  "relatedId": 1,
  "description": "Photo description"
}
```

### Get Photos by Type
```
GET /api/photos/type/{photoType}

Response (200):
[
  {
    "id": 1,
    "fileName": "photo_12345.jpg",
    "photoType": "EVENT",
    "relatedId": 1,
    "description": "Photo description"
  }
]
```

### Get Photos by Entity
```
GET /api/photos/entity/{relatedId}

Response (200):
[
  {
    "id": 1,
    "fileName": "photo_12345.jpg",
    "photoType": "EVENT",
    "relatedId": 1,
    "description": "Photo description"
  }
]
```

### Get Photos by Type and Entity
```
GET /api/photos/{photoType}/{relatedId}

Response (200):
[
  {
    "id": 1,
    "fileName": "photo_12345.jpg",
    "photoType": "EVENT",
    "relatedId": 1,
    "description": "Photo description"
  }
]
```

### Get Photo by ID
```
GET /api/photos/{id}

Response (200):
{
  "id": 1,
  "fileName": "photo_12345.jpg",
  "photoType": "EVENT",
  "relatedId": 1,
  "description": "Photo description"
}
```

### Delete Photo (Admin Only)
```
DELETE /api/photos/{id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Photo deleted successfully"
}
```

---

## 8. BOARD MEMBERS ENDPOINTS
**Base URL:** `/board-members`

### Get All Board Members
```
GET /board-members

Response (200):
[
  {
    "id": 1,
    "memberName": "Sri Krishnan",
    "position": "President",
    "email": "krishnan@temple.com",
    "phone": "9876543210"
  }
]
```

### Get Board Member by ID
```
GET /board-members/{id}

Response (200):
{
  "id": 1,
  "memberName": "Sri Krishnan",
  "position": "President",
  "email": "krishnan@temple.com",
  "phone": "9876543210"
}
```

### Create Board Member
```
POST /board-members
Content-Type: application/json

Request Body:
{
  "memberName": "Sri Krishnan",
  "position": "President",
  "email": "krishnan@temple.com",
  "phone": "9876543210"
}

Response (201):
{
  "id": 1,
  ...
}
```

### Update Board Member
```
PUT /board-members/{id}
Content-Type: application/json

Request Body: (same as create)

Response (200):
{
  "id": 1,
  ...
}
```

### Delete Board Member
```
DELETE /board-members/{id}

Response (200):
{
  "message": "Board member deleted successfully"
}
```

---

## 9. CONTACT ENDPOINTS
**Base URL:** `/contact`

### Submit Contact Form
```
POST /contact
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "Contact message"
}

Response (201):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "Contact message",
  "createdAt": "2025-01-15T10:30:00"
}
```

### Get All Contacts
```
GET /contact

Response (200):
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "message": "Contact message",
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

---

## 10. ADMIN ENDPOINTS
**Base URL:** `/api/admin`

Admin-specific dashboard and management endpoints.
```
GET /api/admin/dashboard - Admin dashboard data
GET /api/admin/statistics - System statistics
GET /api/admin/users - Manage admin users
POST /api/admin/users - Create new admin user
PUT /api/admin/users/{id} - Update admin user
DELETE /api/admin/users/{id} - Delete admin user
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Only admins can perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## 🔑 Authentication

### Default Credentials
```
Username: admin
Password: admin123
```

### Using JWT Token
All admin-protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

### Local Environment Configuration
In `application-local.yml`:
```yaml
app:
  auth:
    enabled: false          # JWT disabled for local testing
    basic-enabled: true     # Basic auth enabled
```

---

## 🗄️ Database Configuration

**Database:** PostgreSQL
**Database Name:** templedb
**Host:** localhost
**Port:** 5432
**Username:** postgres
**Password:** admin123

### Auto-Created Tables
- admins
- events
- service_item
- staff
- temple_timing
- donors
- contact
- photo
- board_members
- sponsorships
- bhojana_shala
- goshala
- vidyalaya

---

## 📊 Database Models

### Admin
```
{
  id: Integer (Primary Key),
  username: String (unique),
  password: String (hashed),
  role: String,
  createdAt: Timestamp
}
```

### Event
```
{
  id: Integer (Primary Key),
  eventName: String,
  description: String,
  eventDate: Date,
  startTime: Time,
  endTime: Time,
  location: String,
  category: String,
  status: String,
  imageUrl: String (nullable),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Service
```
{
  id: Integer (Primary Key),
  serviceName: String,
  description: String,
  price: Double,
  category: String,
  isActive: Boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Staff
```
{
  id: Integer (Primary Key),
  staffName: String,
  position: String,
  department: String,
  phone: String,
  email: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### TempleTime (Timing)
```
{
  id: Integer (Primary Key),
  dayOfWeek: String,
  openingTime: Time,
  closingTime: Time,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Donor
```
{
  id: Integer (Primary Key),
  donorName: String,
  email: String,
  phone: String,
  donationAmount: Double,
  donationType: String,
  donationDate: Date,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Photo
```
{
  id: Integer (Primary Key),
  fileName: String,
  photoType: String,
  relatedId: Integer,
  description: String (nullable),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Contact
```
{
  id: Integer (Primary Key),
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: Timestamp
}
```

### BoardMember
```
{
  id: Integer (Primary Key),
  memberName: String,
  position: String,
  email: String,
  phone: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🚀 Starting the Application

### 1. Ensure Database Exists
```powershell
# Check if templedb exists
psql -U postgres -l | findstr templedb
```

### 2. Start Backend
```bash
java -jar target/temple-backend-1.0.0.jar
```

### 3. Verify Backend is Running
```bash
curl http://localhost:8080/events
```

### 4. Start Frontend (separate terminal)
```bash
cd path/to/temple_react_full
npm install
npm run build
serve -s build -l 3000
```

---

## 📋 Endpoint Summary Table

| Module | Endpoint | Method | Auth Required | Notes |
|--------|----------|--------|---------------|-------|
| Events | /events | GET | No | Get all events |
| Events | /events/{id} | GET | No | Get single event |
| Events | /events | POST | Yes (Admin) | Multipart form-data |
| Events | /events/{id} | PUT | Yes (Admin) | Multipart form-data |
| Events | /events/{id} | DELETE | Yes (Admin) | - |
| Services | /services | GET | No | - |
| Services | /services | POST | No* | *May require admin |
| Staff | /staff | GET | No | - |
| Staff | /staff/department/{dept} | GET | No | - |
| Timings | /timings | GET | No | - |
| Timings | /timings/day/{day} | GET | No | - |
| Donors | /donors | GET | No | - |
| Donors | /donors | POST | No* | *May require admin |
| Photos | /api/photos/upload/{type}/{id} | POST | Yes (Admin) | Multipart form-data |
| Photos | /api/photos/type/{type} | GET | No | - |
| Auth | /auth/login | POST | No | - |
| Auth | /auth/me | GET | Yes | - |
| Contact | /contact | POST | No | - |
| Contact | /contact | GET | No | - |
| Board | /board-members | GET/POST/PUT/DELETE | Varies | CRUD operations |

---

## 🐛 Troubleshooting

### Events Not Loading
```powershell
# Check if backend is running
curl http://localhost:8080/events

# Check database connection
psql -U postgres -d templedb -c "SELECT * FROM events;"
```

### Database Connection Failed
```powershell
# Verify PostgreSQL is running
Get-Service postgresql*

# Check if templedb exists
psql -U postgres -l
```

### Port Already in Use
```powershell
# Stop existing Java processes
Get-Process -Name java | Stop-Process -Force
```

### CORS Errors
- Backend CORS is configured for `http://localhost:3000`
- Ensure frontend is running on port 3000

---

## 📝 Important Notes

- **Port Difference:** Backend runs on port **8080** (not 5000)
- **No /api prefix:** Most endpoints don't have `/api` prefix (except `/api/photos` and `/api/admin`)
- **Multipart Requests:** Events and photos use `multipart/form-data` (not pure JSON)
- **Authentication:** Local environment has JWT disabled for easier development
- **File Uploads:** Support jpg, jpeg, png, webp, gif (max 5MB)
- **Date Format:** Use ISO 8601 format (YYYY-MM-DD)
- **Time Format:** Use 24-hour format (HH:MM:SS)

---

**Last Updated:** November 28, 2025  
**Backend Version:** 1.0.0  
**Database:** PostgreSQL (templedb)  
**Framework:** Spring Boot  
**Java Version:** 11+
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Only admins can perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Authentication Headers
All admin-protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

The JWT token is obtained from the login endpoint.

---

## Database Models

### User
```
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed),
  name: String,
  role: String ("admin" | "user"),
  createdAt: Date
}
```

### Event
```
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  category: String,
  image: String (filename),
  createdAt: Date,
  updatedAt: Date
}
```

### Service
```
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Staff
```
{
  _id: ObjectId,
  name: String,
  position: String,
  department: String,
  phone: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Timing
```
{
  _id: ObjectId,
  day: String,
  open: String (HH:MM),
  close: String (HH:MM),
  updatedAt: Date
}
```

### Holiday
```
{
  _id: ObjectId,
  date: Date,
  name: String,
  createdAt: Date
}
```

### Image
```
{
  _id: ObjectId,
  filename: String,
  title: String,
  description: String,
  url: String,
  size: Number,
  mimetype: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Donor
```
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  amount: Number,
  donationType: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables
```
MONGO_URI=mongodb://localhost:27017/temple
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
```

---

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All times should be in 24-hour format (HH:MM)
- File uploads support: jpg, jpeg, png, webp, gif
- Max file size: 5MB
- Pagination defaults: limit=50, page=1
