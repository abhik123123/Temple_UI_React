# API Integration Structure - Each Page with Separate Admin API

## Overview
The temple application now has complete separation between **User Pages** (read-only views) and **Admin Dashboard** (management pages). Each entity has dedicated API endpoints for CRUD operations.

---

## Application Routes & Structure

### USER ROUTES (Public, Read-Only)
```
GET  /                    → UserHome (view only)
GET  /events             → Events (list & view only)
GET  /services           → Services (list & view only)
GET  /staff              → Staff (list & view only)
GET  /timings            → Timings (display only)
GET  /donors             → Donors (view donations only)
GET  /board-members      → Board Members (view only)
```

### ADMIN ROUTES (Protected, Full CRUD)
```
GET  /admin/dashboard    → AdminDashboard (7 tabs with full management)
```

---

## API Endpoints by Entity

### 1. HOME IMAGES API
**File:** `src/services/templeAPI.js` → `imagesAPI`

```javascript
// USER - View Images
GET /api/images/home
  Response: [{ id, filename, title, url, uploadedAt, size }]

// ADMIN - Upload Image
POST /api/images/home
  Headers: Content-Type: multipart/form-data
  FormData: { file, title }
  Response: { id, filename, title, url, uploadedAt, size }

// ADMIN - Update Image Metadata
PUT /api/images/home/:id
  Input: { title }
  Response: { id, filename, title, url }

// ADMIN - Delete Image
DELETE /api/images/home/:id
  Response: { success: true }

// ADMIN - Download Image
GET /api/images/home/:id/download
  Response: File blob
```

**Admin Component:** `AdminDashboard.jsx` → Tab: "🖼️ Images"
- Upload form with file input
- Image list with edit/delete buttons
- FormData handling for multipart uploads

---

### 2. EVENTS API
**File:** `src/services/templeAPI.js` → `eventsAPI`

```javascript
// USER - View All Events
GET /api/events
  Query: { page, limit, month, year }
  Response: { events, total, pages }

// USER - View Single Event
GET /api/events/:id
  Response: { id, title, date, time, location, description, imageUrl, createdAt }

// ADMIN - Create Event
POST /api/events
  Input: {
    title,
    date (YYYY-MM-DD),
    time (HH:MM),
    location,
    description
  }
  Response: { id, ...event data }

// ADMIN - Update Event
PUT /api/events/:id
  Input: { title?, date?, time?, location?, description?, imageUrl? }
  Response: { id, ...updated event data }

// ADMIN - Delete Event
DELETE /api/events/:id
  Response: { success: true }
```

**User Component:** `Events.jsx` → List events with filtering
**Admin Component:** `AdminDashboard.jsx` → Tab: "📅 Events"
- Create/Edit/Delete form
- Event list table with date/time display
- Filtering by month/year

---

### 3. SERVICES API
**File:** `src/services/templeAPI.js` → `servicesAPI`

```javascript
// USER - View All Services
GET /api/services
  Response: [{ id, name, description, icon, category }]

// USER - View Single Service
GET /api/services/:id
  Response: { id, name, description, icon, category }

// ADMIN - Create Service
POST /api/services
  Input: {
    name,
    description,
    icon (emoji),
    category
  }
  Response: { id, ...service data }

// ADMIN - Update Service
PUT /api/services/:id
  Input: { name?, description?, icon?, category? }
  Response: { id, ...updated service data }

// ADMIN - Delete Service
DELETE /api/services/:id
  Response: { success: true }
```

**User Component:** `Services.jsx` → Display service cards
**Admin Component:** `AdminDashboard.jsx` → Tab: "🙏 Services"
- Grid layout for services
- Edit/Delete buttons for each service
- Icon/Emoji support

---

### 4. STAFF API
**File:** `src/services/templeAPI.js` → `staffAPI`

```javascript
// USER - View All Staff
GET /api/staff
  Response: [{ id, name, position, designation, email, phone, photoUrl, bio }]

// USER - View Single Staff Member
GET /api/staff/:id
  Response: { id, name, position, designation, email, phone, photoUrl, bio }

// ADMIN - Add Staff Member
POST /api/staff
  Input: {
    name,
    position,
    designation,
    email,
    phone,
    bio,
    photoFile (optional)
  }
  Response: { id, ...staff data }

// ADMIN - Update Staff Member
PUT /api/staff/:id
  Input: { name?, position?, designation?, email?, phone?, bio?, photoFile? }
  Response: { id, ...updated staff data }

// ADMIN - Delete Staff Member
DELETE /api/staff/:id
  Response: { success: true }
```

**User Component:** `Staff.jsx` → Display staff directory
**Admin Component:** `AdminDashboard.jsx` → Tab: "👥 Staff"
- Staff directory cards
- Edit/Delete functionality
- Photo upload support

---

### 5. TIMINGS API
**File:** `src/services/templeAPI.js` → `timingsAPI`

```javascript
// USER - View Temple Timings
GET /api/timings
  Response: {
    monday: { open: "06:00", close: "21:00" },
    tuesday: { ... },
    ... (all 7 days),
    holidays: [{ date: "2025-12-25", reason: "Christmas" }]
  }

// ADMIN - Update Day Timings
PUT /api/timings/:day
  Input: { open: "HH:MM", close: "HH:MM", note? }
  Response: { day, open, close, note }

// ADMIN - Add Holiday
POST /api/timings/holidays
  Input: { date: "YYYY-MM-DD", reason }
  Response: { date, reason, closed: true }

// ADMIN - Remove Holiday
DELETE /api/timings/holidays/:id
  Response: { success: true }
```

**User Component:** `Timings.jsx` → Display opening hours
**Admin Component:** `AdminDashboard.jsx` → Tab: "⏰ Timings"
- Time input for each day
- Real-time display of formatted times
- Holiday management

---

### 6. DONORS API
**File:** `src/services/templeAPI.js` → `donorsAPI`

```javascript
// USER - View Donors (Public)
GET /api/donors
  Query: { page, limit, month, year, type }
  Response: { donors: [...], total, statistics: { totalAmount, count, average } }

// USER - View Donation Statistics
GET /api/donors/statistics
  Response: {
    totalDonations,
    averageDonation,
    donorCount,
    topDonors: [...],
    byType: { Cash, Check, Online, ... }
  }

// ADMIN - Create Donor Record
POST /api/donors
  Input: {
    donorName,
    amount,
    donationType (Cash, Check, Online, Gold, Silver, Material, Other),
    donationDate (YYYY-MM-DD),
    inMemoryOf?,
    donationReason?,
    email?,
    phone?
  }
  Response: { id, ...donor data }

// ADMIN - Update Donor
PUT /api/donors/:id
  Input: { donorName?, amount?, donationType?, donationDate?, inMemoryOf? }
  Response: { id, ...updated donor data }

// ADMIN - Delete Donor
DELETE /api/donors/:id
  Response: { success: true }

// ADMIN - Export Donors List
GET /api/donors/export
  Response: File blob (CSV/Excel)
```

**User Component:** `Donors.jsx` → Donation management with statistics
**Admin Component:** `AdminDashboard.jsx` → Tab: "💝 Donors"
- Donor list with delete functionality
- Statistics display
- Filtering by date/type

---

## API Service File Structure

**File:** `src/services/templeAPI.js`

```javascript
// Example API function
export const eventsAPI = {
  getAll: (params = {}) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`)
};

// Axios instance with interceptors
const api = axios.create({ baseURL: BASE_URL });

// Auto-attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## Error Handling & Status Codes

All API responses follow standard HTTP status codes:

```
200 OK              → Successful GET/PUT/DELETE
201 Created         → Successful POST
400 Bad Request     → Validation error
401 Unauthorized    → Missing/invalid token
403 Forbidden       → Admin role required
404 Not Found       → Resource doesn't exist
500 Server Error    → Backend error
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "error message" }
}
```

---

## Admin Dashboard Tabs & APIs Used

| Tab | Label | APIs Used |
|-----|-------|-----------|
| 📈 Dashboard | Overview stats | eventsAPI, servicesAPI, staffAPI, donorsAPI, imagesAPI |
| 🖼️ Images | Home image management | imagesAPI (CRUD) |
| 📅 Events | Event management | eventsAPI (CRUD) |
| 🙏 Services | Service management | servicesAPI (CRUD) |
| 👥 Staff | Staff directory | staffAPI (CRUD) |
| ⏰ Timings | Temple hours | timingsAPI (update/holidays) |
| 💝 Donors | Donor management | donorsAPI (CRUD + statistics) |

---

## User Pages & APIs Used

| Page | Route | APIs Used |
|------|-------|-----------|
| UserHome | / | imagesAPI (GET) |
| Events | /events | eventsAPI (GET) |
| Services | /services | servicesAPI (GET) |
| Staff | /staff | staffAPI (GET) |
| Timings | /timings | timingsAPI (GET) |
| Donors | /donors | donorsAPI (GET) |
| BoardMembers | /board-members | - |

---

## Authentication & Authorization

**Login Flow:**
```
1. User provides credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token automatically attached to all API requests
5. Admin route checks user.role === 'admin'
```

**Protected Routes:**
```javascript
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

---

## Environment Configuration

**Environment Variables:**
```
REACT_APP_API_BASE_URL=http://localhost:5000/api  (Development)
REACT_APP_API_BASE_URL=https://api.example.com    (Production)
```

**Base URL in templeAPI.js:**
```javascript
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
```

---

## Database Relationships

```
users
  ├─ donators (1:M via createdBy)
  ├─ events (1:M via createdBy)
  ├─ services (1:M via createdBy)
  ├─ staff (1:M via createdBy)
  ├─ timings (1:M via updatedBy)
  └─ images (1:M via uploadedBy)

images
  ├─ events (1:M via imageUrl)
  └─ staff (1:M via photoUrl)

donors
  └─ no foreign keys

events
  └─ images (M:1 via imageUrl)
```

---

## Example Implementations

### Create Event (Admin)
```javascript
const handleAddEvent = async () => {
  try {
    const res = await eventsAPI.create({
      title: "Diwali Celebration",
      date: "2025-11-15",
      time: "18:30",
      location: "Main Temple Hall",
      description: "Grand Diwali celebration"
    });
    setEvents([...events, res.data]);
  } catch (err) {
    alert('Failed: ' + err.response?.data?.message);
  }
};
```

### Upload Image (Admin)
```javascript
const handleImageUpload = async (e) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('title', imageTitle);
  
  const res = await imagesAPI.upload(formData);
  setHomeImages([...homeImages, res.data]);
};
```

### Fetch Events (User)
```javascript
useEffect(() => {
  eventsAPI.getAll({ limit: 10 })
    .then(res => setEvents(res.data.events))
    .catch(err => setError(err.message));
}, []);
```

---

## Next Steps for Backend Development

1. **Set up Node.js + Express server** on port 5000
2. **Install dependencies:** Express, JWT, bcrypt, Multer, CORS
3. **Create database schema** (PostgreSQL recommended)
4. **Implement authentication endpoints** (/auth/login, /auth/refresh)
5. **Implement CRUD endpoints** for each entity
6. **Add file upload handling** for images and photos
7. **Deploy to production** (AWS, Heroku, DigitalOcean)

---

## Summary

✅ **User Pages:** Read-only views with GET endpoints
✅ **Admin Dashboard:** Full CRUD management with POST/PUT/DELETE endpoints
✅ **API Separation:** Each entity has dedicated API service functions
✅ **Authentication:** JWT token-based with role checking
✅ **Error Handling:** Comprehensive error messages
✅ **FormData Support:** Image/file uploads using multipart/form-data
✅ **Environment Config:** Configurable API base URL
