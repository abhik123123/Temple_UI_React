const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Create uploads directory if it doesn't exist (for local storage)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Created uploads directory');
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory (for local development)
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    storage: process.env.STORAGE_TYPE || 'local',
    timestamp: new Date().toISOString()
  });
});

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const servicesRoutes = require('./routes/services');
const staffRoutes = require('./routes/staff');
const boardMembersRoutes = require('./routes/boardMembers');
const timingsRoutes = require('./routes/timings');
const donorsRoutes = require('./routes/donors');
const priestsRoutes = require('./routes/priests');
const galleryRoutes = require('./routes/gallery');
const newsletterRoutes = require('./routes/newsletter');
const dailyPrayersRoutes = require('./routes/dailyPrayers');
const notificationsRoutes = require('./routes/notifications');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/board-members', boardMembersRoutes);
app.use('/api/timings', timingsRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/priests', priestsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/daily-prayers', dailyPrayersRoutes);
app.use('/api/notifications', notificationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🕉️  Temple Backend Server');
  console.log('=================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Storage: ${process.env.STORAGE_TYPE || 'local'}`);
  console.log(`✓ API URL: http://localhost:${PORT}/api`);
  console.log('=================================');
});

module.exports = app;
