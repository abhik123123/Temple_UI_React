# Admin Login Guide

## Quick Start

### Step 1: Go to Login Page
Visit: `http://localhost:3000/login`

### Step 2: Enter Admin Credentials

**Default Admin Credentials (Local Development):**
- **Username:** `admin`
- **Password:** `admin123`

### Step 3: Click Login

You will be authenticated and redirected to the home page.

---

## After Login

Once logged in, you will see:

1. **Your name appears in the navigation bar** (top right)
2. **Admin-only links appear in the navigation:**
   - 📅 Events Manager → `/events/admin`
   - ⚙️ Admin Dashboard → `/admin/dashboard`

3. **Logout button** appears in the top right navigation

---

## Access Admin Pages

### Events Management (`/events/admin`)
- View all events
- Create new events (+ Add Event button)
- Edit existing events
- Delete events with confirmation
- Full CRUD operations

### Admin Dashboard (`/admin/dashboard`)
- 7 management tabs:
  1. 📈 Dashboard - Statistics
  2. 🖼️ Images - Upload and manage carousel images
  3. 📅 Events - Event management
  4. 🙏 Services - Service management
  5. 👥 Staff - Staff directory
  6. ⏰ Timings - Temple hours
  7. 💝 Donors - Donor tracking

---

## Authentication Flow

### Current Environment (Local - No Auth Required)

**Current Setting:** `requireAuth = false`

This means:
- ✅ Login form is disabled (grayed out)
- ✅ You can auto-login with any username
- ✅ No actual authentication check
- ✅ Admin role is automatically granted

**How to login in this mode:**
1. Go to `/login`
2. The form is disabled/grayed out
3. Just refresh or navigate to `/` 
4. You will be auto-authenticated as admin

### Production Environment (JWT Required)

In production (`requireAuth = true`):
- ✅ Username and password are required
- ✅ Backend validates credentials
- ✅ JWT token is returned and stored
- ✅ Token is sent with all API requests

---

## User Roles

### Admin Role (you have this after login)
✅ Can access `/events/admin`
✅ Can access `/admin/dashboard`
✅ Can create, edit, delete events
✅ Can manage all temple data
✅ Can upload images
✅ Can manage staff, services, timings, donors

### Regular User (without admin role)
❌ Cannot access `/events/admin`
❌ Cannot access `/admin/dashboard`
✅ Can only view events at `/events`
✅ Can register for events
✅ Can view services, staff, timings
✅ Can make donations

---

## Logout

Click the **Logout** button in the top right navigation to:
- Clear authentication
- Remove JWT token from localStorage
- Return to login page
- All admin links disappear

---

## Environment Configuration

The authentication behavior is controlled by `src/config/environment.js`:

### Local/Dev Environment (Current)
```javascript
requireAuth: false,          // Authentication not required
authType: 'basic',          // Username/Password
defaultUsername: 'admin',   // Default username
defaultPassword: 'admin123' // Default password
```

### Production Environment
```javascript
requireAuth: true,          // Authentication required
authType: 'jwt',           // JWT tokens
useJWT: true,              // Store JWT in localStorage
```

---

## Test Credentials Summary

| Environment | Username | Password | Location |
|------------|----------|----------|----------|
| Local/Dev | admin | admin123 | http://localhost:3000/login |
| Production | (From Backend) | (From Backend) | https://temple.com/login |

---

## Troubleshooting

### "Admin links not appearing in navigation"
- Make sure you're logged in
- Check browser console for errors
- Clear localStorage and refresh

### "Access Denied" on `/events/admin`
- You may not be authenticated
- Go to `/login` and authenticate
- After login, try again

### "Still see loading..."
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

---

## API Integration (When Backend is Ready)

Once you build the backend:

1. Update `src/config/environment.js` with backend URL
2. Set `requireAuth: true` for production
3. Backend will validate credentials and return JWT token
4. Frontend will send token with all API requests

**Example Backend Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "admin",
  "name": "Administrator",
  "role": "admin"
}
```

---

## Current Status

✅ **Frontend:** Login page ready
✅ **Frontend:** Role-based routing configured
✅ **Frontend:** Admin pages protected
✅ **Frontend:** Mock data available
⏳ **Backend:** Not yet implemented (needed for real authentication)

---

## Next Steps

When you're ready to implement the backend:

1. Create Node.js + Express server
2. Implement `/api/auth/login` endpoint
3. Add JWT token generation
4. Create admin user in database
5. Test with actual credentials
6. Update environment config

See `BACKEND_REQUIREMENTS.md` for complete backend API specification.
