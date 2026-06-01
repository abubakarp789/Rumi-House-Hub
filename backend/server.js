const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas (or local fallback)
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communications
app.use(cors());

// Enable JSON body request parsing
app.use(express.json());

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
const authRoutes = require('./routes/authRoutes');
const societyRoutes = require('./routes/societyRoutes');
const eventRoutes = require('./routes/eventRoutes');
const newsRoutes = require('./routes/newsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use('/api/auth', authRoutes);
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

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Rumi House Hub MERN Server active on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
