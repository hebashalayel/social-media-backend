const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter - applied to all requests
 * Uses Fixed Window algorithm (simplest, suitable for general protection)
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication routes (login/register)
 * Prevents brute force attacks
 * Fixed Window algorithm is appropriate for login attempts
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again after 15 minutes.'
    }
  }
});

/**
 * Stricter rate limiter for registration
 * Prevents spam account creation
 */
const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 accounts per hour per IP
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many accounts created from this IP, please try again later.'
    }
  }
});

/**
 * Rate limiter for post creation (POST /api/posts)
 * Token Bucket behavior approximated via higher limit with shorter window
 */
const postRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 posts per hour
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Post limit reached. Maximum 50 posts per hour.'
    }
  }
});

/**
 * Rate limiter for likes (POST /api/posts/:id/like)
 * Sliding Window approximation with very short window
 */
const likeRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 likes per 10 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Like limit reached. Maximum 100 likes per 10 minutes.'
    }
  }
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  registerRateLimiter,
  postRateLimiter,
  likeRateLimiter
};