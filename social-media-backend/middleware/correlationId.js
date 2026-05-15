const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to generate a unique request ID (Correlation ID) for each request
 * Stores it in req.id and also sets it in the response header
 * This enables tracking a single request across multiple services/logs
 */
const correlationId = (req, res, next) => {
  // Generate a unique ID for this request
  const requestId = uuidv4();
  
  // Attach to request object for use in other middleware/routes
  req.id = requestId;
  
  // Set in response headers for client-side tracking
  res.setHeader('X-Request-Id', requestId);
  
  next();
};

module.exports = correlationId;