const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/board-members', require('./src/routes/boardMembers'));
app.use('/api/events',        require('./src/routes/events'));
app.use('/api/services',      require('./src/routes/services'));
app.use('/api/staff',         require('./src/routes/staff'));
app.use('/api/timings',       require('./src/routes/timings'));
app.use('/api/gallery',       require('./src/routes/gallery'));
app.use('/api/donors',        require('./src/routes/donors'));
app.use('/api/bajanas',       require('./src/routes/bajanas'));
app.use('/api/daily-poojas',  require('./src/routes/dailyPoojas'));
app.use('/api/pooja-books',   require('./src/routes/poojaBooks'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Temple Backend API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Raja Rajeshwara Temple API',
    version: '1.0.0',
    endpoints: {
      boardMembers: '/api/board-members',
      events:       '/api/events',
      services:     '/api/services',
      staff:        '/api/staff',
      timings:      '/api/timings',
      gallery:      '/api/gallery',
      health:       '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Temple Backend running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/health`);
  console.log(`📍 http://localhost:${PORT}/api/events`);
  console.log(`📍 http://localhost:${PORT}/api/services`);
  console.log(`📍 http://localhost:${PORT}/api/staff`);
  console.log(`📍 http://localhost:${PORT}/api/timings`);
  console.log(`📍 http://localhost:${PORT}/api/gallery`);
  console.log(`📍 http://localhost:${PORT}/api/board-members\n`);
});

module.exports = app;
