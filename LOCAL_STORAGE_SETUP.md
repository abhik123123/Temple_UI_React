# Local Storage Configuration - No Backend Required

## Overview
Your Temple Management UI now runs **completely standalone** using browser's localStorage for data persistence. No backend server or Java application is needed!

## Default Login Credentials
```
Username: admin
Password: admin123
```

## Features

### ✅ What Works Without Backend:
- **Events Management** - Create, edit, delete events with images
- **Services Management** - Manage temple services
- **Timings Management** - Update temple opening hours
- **Staff Management** - Add/edit staff members
- **Donors Management** - Track donations
- **Authentication** - Simple local login system
- **Image Storage** - Images stored as base64 in localStorage

### 🔄 Data Storage:
All data is stored in browser's localStorage with these keys:
- `temple_events` - Events data
- `temple_services` - Services data
- `temple_timings` - Temple timings
- `temple_staff` - Staff members
- `temple_donors` - Donors information
- `temple_auth_token` - Auth token
- `temple_current_user` - Current logged-in user

### 📦 Sample Data:
The application initializes with sample data:
- 2 sample events (Diwali Celebration, Lord Shiva Puja)
- 2 sample services (Abhishekam, Archana)
- Weekly temple timings (Mon-Sun)

## How to Use

### 1. Start the Application
```bash
npm start
```

### 2. Login
- Navigate to `/login`
- Enter credentials: admin / admin123
- Click Login

### 3. Access Admin Features
After login, you can:
- Go to `/events/admin` to manage events
- Go to `/services/admin` to manage services
- Go to `/timings/admin` to manage timings
- And more...

## Image Handling
Images are converted to base64 and stored in localStorage:
- Supports all image formats (JPG, PNG, WebP, GIF, etc.)
- Automatically converted to JPEG for optimization
- Stored directly in browser
- No file server required

## Data Persistence
- Data persists across browser sessions
- Stored locally in your browser
- To reset data: Clear browser's localStorage
- To backup data: Export localStorage using browser dev tools

## Advantages of This Setup
✅ No backend server needed  
✅ No database required  
✅ No network calls  
✅ Instant response times  
✅ Works offline  
✅ Easy deployment (just static files)  
✅ No server costs  

## Limitations
⚠️ Data is stored per browser (not shared across devices)  
⚠️ Clearing browser data will reset everything  
⚠️ localStorage has ~5-10MB limit per domain  
⚠️ Not suitable for production with multiple users  

## Deployment
Since it's a pure frontend app, you can deploy to:
- **GitHub Pages** - Free static hosting
- **Netlify** - Free with custom domain
- **Vercel** - Free deployment
- **Firebase Hosting** - Free tier available
- **AWS S3** - Static website hosting
- **Any web server** - Just upload the build folder

### Build for Production
```bash
npm run build
```

Then upload the `build` folder to your hosting service.

## Resetting Data
To reset to default sample data:
1. Open browser DevTools (F12)
2. Go to Application > Storage > localStorage
3. Delete all temple_* keys
4. Refresh the page

## Future Enhancements
If you later need a backend, you can:
- Switch the API calls in `templeAPI.js` back to HTTP requests
- Keep the same component structure
- The UI code doesn't need to change

## Technical Details
- **Framework**: React 18
- **Storage**: Browser localStorage API
- **Auth**: Simple credential validation
- **Images**: Base64 encoding
- **API Layer**: Promise-based async functions mimicking REST API

---

**Note**: This is perfect for:
- Personal use
- Demo/prototype
- Small community temples
- Development/testing
- Single-user scenarios
