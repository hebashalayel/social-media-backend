const winston = require('winston');

// Configure Winston logger with JSON format
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

/**
 * Middleware to log request lifecycle (Ingress and Egress)
 * Implements Lifecycle Interception as per theoretical research
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // INGRESS LOG - Request enters the server
  logger.info({
    type: 'INGRESS',
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Capture response body (for error tracking only)
  let originalJson = res.json;
  res.json = function(body) {
    res.body = body;
    return originalJson.call(this, body);
  };
  
  // EGRESS LOG - Response is sent
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    const logLevel = res.statusCode >= 500 ? 'error' : 
                     res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log({
      level: logLevel,
      type: 'EGRESS',
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

module.exports = requestLogger;