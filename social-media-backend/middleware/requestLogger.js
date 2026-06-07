const winston = require('winston');
const { getContextItem } = require('./requestContext');

// Configure Winston logger with JSON format
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Changed to pure JSON for better structured logging
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

/**
 * Middleware to log request lifecycle (Ingress and Egress)
 * Now utilizes AsyncLocalStorage context for shared data
 */
const requestLogger = (req, res, next) => {
  const requestId = getContextItem('requestId') || req.id;
  
  // INGRESS LOG
  logger.info({
    type: 'INGRESS',
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // EGRESS LOG
  res.on('finish', () => {
    const startTime = getContextItem('startTime');
    const responseTime = startTime ? Date.now() - startTime : 'unknown';
    
    const logLevel = res.statusCode >= 500 ? 'error' : 
                     res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log({
      level: logLevel,
      type: 'EGRESS',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      etag: res.get('ETag'), // Log ETag for caching validation
      cacheControl: res.get('Cache-Control'),
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

module.exports = requestLogger;
