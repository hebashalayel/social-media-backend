const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const correlationId = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { connectMongoDB, connectRedis, getRedisClient } = require('./config/database');  // ← معدل
const routes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Custom middleware
app.use(correlationId);
app.use(requestLogger);

// 3. Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
}));

// 4. Global rate limiting
app.use(globalRateLimiter);

// 5. Routes
app.use('/api', routes);

// 6. 404 handler (fixed: no '*' wildcard)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
      requestId: req.id
    }
  });
});

// 7. Centralized error handler
app.use(errorHandler);

// ========== START SERVER ==========
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectRedis().catch(err => {
      console.warn('Redis connection warning:', err.message);
    });
    
    app.listen(PORT, () => {
      console.log(`
      ════════════════════════════════════════
      🚀 Server running on port ${PORT}
      📍 API URL: http://localhost:${PORT}
      🌍 Environment: ${process.env.NODE_ENV || 'development'}
      ════════════════════════════════════════
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;