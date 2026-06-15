const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Enable CORS for frontend communications
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Enable JSON body request parsing with size limit
app.use(express.json({ limit: '1mb' }));

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'Rumi House Hub MERN API is running successfully with MongoDB connectivity.',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Mounting REST Routes
// ----------------------------------------------------
const rateLimiter = require('./middleware/rateLimitMiddleware');
const authRoutes = require('./routes/authRoutes');
const societyRoutes = require('./routes/societyRoutes');
const eventRoutes = require('./routes/eventRoutes');
const newsRoutes = require('./routes/newsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use('/api/auth', rateLimiter(100, 15 * 60 * 1000), authRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);

// Mount attendance checks on /api/events matching endpoint routes
app.use('/api/events', attendanceRoutes);

// Unknown API route fallback keeps REST errors consistent for the frontend.
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `No API route matches ${req.method} ${req.originalUrl}.`
  });
});

// ----------------------------------------------------
// Centralized Error Handling Middleware
// ----------------------------------------------------
app.use(errorHandler);

// Start only after database connectivity is established.
const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters.');
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log('=================================================');
      console.log(`Rumi House Hub MERN Server active on port ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log('=================================================');
    });
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
