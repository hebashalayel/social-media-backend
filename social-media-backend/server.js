const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const correlationId = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const { requestContextMiddleware } = require('./middleware/requestContext');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { connectMongoDB, connectRedis } = require('./config/database');
const routes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security Headers (Helmet) - Advanced Config
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'same-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// 2. CORS - Advanced Config
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Tenant-ID'],
  exposedHeaders: ['X-Request-Id', 'ETag'],
  maxAge: 600, // Cache preflight requests for 10 minutes
}));

// 3. Performance & Optimization
app.use(compression()); // Gzip compression
app.set('etag', 'strong'); // Enable Strong ETag for caching validation

// 4. Request Body Size Limits (Security)
app.use(express.json({ limit: '10kb' })); // Limit JSON body to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Context & Observability
app.use(correlationId);
app.use(requestContextMiddleware); // AsyncLocalStorage
app.use(requestLogger);

// 6. Global Rate Limiting
app.use(globalRateLimiter);

// 7. Cache-Control Middleware (General)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60'); // Default cache for 1 minute
  } else {
    res.set('Cache-Control', 'no-store'); // No cache for state-changing requests
  }
  next();
});

// 8. Routes
app.use('/api', routes);

// 9. 404 handler
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

// 10. Centralized error handler
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
