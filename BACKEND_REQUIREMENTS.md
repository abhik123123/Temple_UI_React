# Backend Requirements for Temple React Application

## Overview
The backend needs to support both user-facing content and admin management capabilities with authentication and authorization.

---

## Authentication & Authorization

### 1. Authentication Endpoints
```
POST /api/auth/login
- Input: { username: string, password: string }
- Output: { token: string, user: { id, name, email, role }, expiresIn: number }
- Roles: 'admin', 'user'

POST /api/auth/logout
- Clear session/token

POST /api/auth/refresh
- Refresh expired token
```

---

## Image Management APIs

### 2. Home Screen Images (Admin Only)

```
GET /api/images/home
- Description: Get all home screen images
- Authentication: Optional (public view)
- Response: [{ id, filename, title, url, uploadedAt, size, uploadedBy }]

POST /api/images/home (Admin Only)
- Description: Upload new home screen image
- Authentication: Required (Admin)
- Input: FormData { file, title }
- Response: { id, filename, title, url, uploadedAt }

PUT /api/images/home/:id (Admin Only)
- Description: Update image metadata
- Authentication: Required (Admin)
- Input: { title }
- Response: { id, filename, title, url }

DELETE /api/images/home/:id (Admin Only)
- Description: Delete home screen image
- Authentication: Required (Admin)
- Response: { success: true }

GET /api/images/home/:id/download (Admin Only)
- Description: Download image
- Authentication: Required (Admin)
- Response: File
```

---

## Events Management APIs

### 3. Events Management

```
GET /api/events
- Description: Get all events (paginated)
- Authentication: Optional
- Query: { page: number, limit: number, month?: string, year?: string }
- Response: { events: [...], total: number, pages: number }

GET /api/events/:id
- Description: Get single event details
- Authentication: Optional
- Response: { id, title, date, time, location, description, imageUrl, createdAt, updatedAt }

POST /api/events (Admin Only)
- Description: Create new event
- Authentication: Required (Admin)
- Input: {
    title: string,
    date: string (YYYY-MM-DD),
    time: string (HH:MM),
    location: string,
    description: string,
    imageUrl?: string
  }
- Response: { id, title, date, time, location, description, imageUrl, createdAt }

PUT /api/events/:id (Admin Only)
- Description: Update event
- Authentication: Required (Admin)
- Input: { title?, date?, time?, location?, description?, imageUrl? }
- Response: { id, title, date, time, location, description, imageUrl, updatedAt }

DELETE /api/events/:id (Admin Only)
- Description: Delete event
- Authentication: Required (Admin)
- Response: { success: true }
```

---

## Services Management APIs

### 4. Services Management

```
GET /api/services
- Description: Get all services
- Authentication: Optional
- Response: [{ id, name, description, icon, category }]

POST /api/services (Admin Only)
- Description: Create new service
- Authentication: Required (Admin)
- Input: {
    name: string,
    description: string,
    icon: string (emoji or icon name),
    category: string
  }
- Response: { id, name, description, icon, category, createdAt }

PUT /api/services/:id (Admin Only)
- Description: Update service
- Authentication: Required (Admin)
- Input: { name?, description?, icon?, category? }
- Response: { id, name, description, icon, category, updatedAt }

DELETE /api/services/:id (Admin Only)
- Description: Delete service
- Authentication: Required (Admin)
- Response: { success: true }
```

---

## Staff Management APIs

### 5. Staff Management

```
GET /api/staff
- Description: Get all staff members
- Authentication: Optional
- Response: [{ id, name, position, designation, email, phone, photoUrl, bio }]

POST /api/staff (Admin Only)
- Description: Add new staff member
- Authentication: Required (Admin)
- Input: FormData {
    name: string,
    position: string,
    designation: string,
    email: string,
    phone: string,
    photoFile: File,
    bio?: string
  }
- Response: { id, name, position, designation, email, phone, photoUrl, bio, createdAt }

PUT /api/staff/:id (Admin Only)
- Description: Update staff member
- Authentication: Required (Admin)
- Input: { name?, position?, designation?, email?, phone?, bio?, photoFile? }
- Response: { id, name, position, designation, email, phone, photoUrl, bio, updatedAt }

DELETE /api/staff/:id (Admin Only)
- Description: Delete staff member
- Authentication: Required (Admin)
- Response: { success: true }
```

---

## Timings Management APIs

### 6. Temple Timings

```
GET /api/timings
- Description: Get temple opening/closing timings
- Authentication: Optional
- Response: {
    monday: { open: "06:00", close: "21:00" },
    tuesday: { open: "06:00", close: "21:00" },
    ... (all days),
    holidays: [{ date: "2025-12-25", closed: true, reason: "Christmas" }]
  }

PUT /api/timings/:day (Admin Only)
- Description: Update timing for specific day
- Authentication: Required (Admin)
- Input: { open: string (HH:MM), close: string (HH:MM), note?: string }
- Response: { day, open, close, note }

POST /api/timings/holidays (Admin Only)
- Description: Add holiday
- Authentication: Required (Admin)
- Input: { date: string (YYYY-MM-DD), reason: string }
- Response: { date, reason, closed: true }

DELETE /api/timings/holidays/:id (Admin Only)
- Description: Remove holiday
- Authentication: Required (Admin)
- Response: { success: true }
```

---

## Donors Management APIs

### 7. Donors Management

```
GET /api/donors
- Description: Get all donors with filtering
- Authentication: Optional (public view without details)
- Query: { page?: number, limit?: number, month?: string, year?: string, type?: string }
- Response: { donors: [...], total: number, statistics: { totalAmount, count, average } }

POST /api/donors (Admin Only)
- Description: Add new donor/donation
- Authentication: Required (Admin)
- Input: {
    donorName: string,
    amount: number,
    donationType: string (Cash, Check, Online, Gold, Silver, Material, Other),
    donationDate: string (YYYY-MM-DD),
    inMemoryOf?: string,
    donationReason?: string,
    email?: string,
    phone?: string
  }
- Response: { id, donorName, amount, donationType, donationDate, inMemoryOf, createdAt }

PUT /api/donors/:id (Admin Only)
- Description: Update donor information
- Authentication: Required (Admin)
- Input: { donorName?, amount?, donationType?, donationDate?, inMemoryOf?, donationReason? }
- Response: { id, donorName, amount, donationType, donationDate, updatedAt }

DELETE /api/donors/:id (Admin Only)
- Description: Delete donor record
- Authentication: Required (Admin)
- Response: { success: true }

GET /api/donors/statistics
- Description: Get donation statistics
- Authentication: Optional
- Response: {
    totalDonations: number,
    averageDonation: number,
    donorCount: number,
    topDonors: [...],
    byType: { Cash: number, Check: number, ... }
  }
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  lastLogin TIMESTAMP
);
```

### Images Table
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  fileUrl VARCHAR(500) NOT NULL,
  fileSize BIGINT,
  mimeType VARCHAR(50),
  uploadedBy UUID REFERENCES users(id),
  category VARCHAR(50) DEFAULT 'home', -- home, events, staff, etc
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  description TEXT,
  imageUrl VARCHAR(500),
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Services Table
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(100),
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Staff Table
```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  designation VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  photoUrl VARCHAR(500),
  bio TEXT,
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Timings Table
```sql
CREATE TABLE timings (
  id UUID PRIMARY KEY,
  dayOfWeek INT (0-6, where 0=Sunday),
  openTime TIME NOT NULL,
  closeTime TIME NOT NULL,
  note VARCHAR(255),
  updatedBy UUID REFERENCES users(id),
  updatedAt TIMESTAMP
);
```

### Holidays Table
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason VARCHAR(255),
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP
);
```

### Donors Table
```sql
CREATE TABLE donors (
  id UUID PRIMARY KEY,
  donorName VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  donationType VARCHAR(50), -- Cash, Check, Online, Gold, Silver, Material, Other
  donationDate DATE NOT NULL,
  inMemoryOf VARCHAR(255),
  donationReason TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## File Upload Strategy

### Storage Options:
1. **Local Storage** (Development)
   - Store files in `/uploads` directory
   - Simple but not scalable

2. **Cloud Storage (Recommended)**
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage
   - Cloudinary (easiest for images)

### File Upload API Response:
```json
{
  "id": "uuid",
  "filename": "original_filename.jpg",
  "fileUrl": "https://cdn.example.com/images/uuid-filename.jpg",
  "fileSize": 2048576,
  "mimeType": "image/jpeg",
  "uploadedAt": "2025-11-28T10:30:00Z"
}
```

---

## Security Requirements

### Authentication:
- JWT tokens for session management
- Token expiration: 24 hours
- Refresh tokens: 30 days

### Authorization:
- Role-based access control (RBAC)
- Admin-only endpoints require admin role
- Public endpoints for user viewing

### Input Validation:
- Validate all input fields
- Sanitize HTML in text fields
- File size limits: 10MB for images
- Allowed file types: jpg, jpeg, png, gif, webp

### API Security:
- CORS configuration
- Rate limiting (100 requests/minute per IP)
- HTTPS only
- SQL injection prevention
- XSS protection

---

## Technology Stack Recommendations

### Backend Framework:
- **Node.js + Express** OR
- **Python + Django/FastAPI** OR
- **Java + Spring Boot**

### Database:
- PostgreSQL (recommended)
- MySQL
- MongoDB

### File Storage:
- AWS S3 or Cloudinary for production
- Local filesystem for development

### Authentication:
- JWT (jsonwebtoken library)
- bcrypt for password hashing

---

## Development Priorities

1. **Phase 1 (MVP):**
   - Authentication endpoints
   - Events CRUD
   - Donations CRUD
   - Image upload/download

2. **Phase 2:**
   - Staff management
   - Services management
   - Timings management

3. **Phase 3:**
   - Statistics/Analytics
   - Email notifications
   - Search & filtering
   - Batch operations

---

## Testing Requirements

- Unit tests for all API endpoints
- Integration tests for database operations
- Authentication/Authorization tests
- File upload tests
- Error handling tests
