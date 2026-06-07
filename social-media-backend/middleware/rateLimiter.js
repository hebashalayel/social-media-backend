const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

/**
 * Advanced Rate Limiter Factory
 */
const createLimiter = ({ windowMs, max, message, keyGenerator }) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: message || 'Too many requests, please try again later.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator || ((req) => ipKeyGenerator(req.ip)),
  });
};

// 1. IP-Based (Global)
const globalRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Global IP rate limit exceeded.'
});

// 2. User-Based (For logged-in users)
const userRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  keyGenerator: (req) => req.user ? req.user.id : ipKeyGenerator(req.ip),
  message: 'User-specific rate limit exceeded.'
});

// 3. Tenant-Based (Simulated via header)
const tenantRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  keyGenerator: (req) => req.header('X-Tenant-ID') || ipKeyGenerator(req.ip),
  message: 'Tenant-specific rate limit exceeded.'
});

// 4. Write-Based (POST, PUT, DELETE)
const writeRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Write operation limit exceeded.'
});

// 5. Search-Based (GET with query params)
const searchRateLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Search frequency limit exceeded.'
});

// 6. Sensitive Endpoint Limiter (e.g., Auth, Delete Account)
const sensitiveEndpointLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many attempts on this sensitive endpoint.'
});

// Aliases for compatibility with Auth routes
const authRateLimiter = sensitiveEndpointLimiter;
const registerRateLimiter = sensitiveEndpointLimiter;

module.exports = {
  globalRateLimiter,
  userRateLimiter,
  tenantRateLimiter,
  writeRateLimiter,
  searchRateLimiter,
  sensitiveEndpointLimiter,
  authRateLimiter,
  registerRateLimiter
};
