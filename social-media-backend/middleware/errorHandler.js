const winston = require('winston');

// Logger for error tracking
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/errors.log' })
  ]
});

/**
 * Custom error class for operational errors
 * Allows consistent error structure across the application
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 * 4-parameter signature identifies it as error-handling middleware
 * Express switches to Error Propagation Mode when next(err) is called
 * 
 * In this mode:
 * - Normal middleware layers are bypassed
 * - Execution jumps to this error handler
 */
const errorHandler = (err, req, res, next) => {
  // Log error with correlation ID for tracing
  logger.error({
    requestId: req.id,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default values
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Data validation failed';
    details = Object.values(err.errors).map(e => e.message);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Handle rate limit errors from express-rate-limit
  if (err.message?.includes('Too many requests')) {
    statusCode = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
    message = 'Too many requests, please try again later';
  }

  // Send unified error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      requestId: req.id
    }
  });
};

module.exports = {
  errorHandler,
  AppError
};