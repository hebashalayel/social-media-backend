const express = require('express');
const {
  createPost,
  getPosts,
  getPopularPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  getUserPosts
} = require('../controllers/postController');
const { 
  userRateLimiter,
  writeRateLimiter,
  searchRateLimiter,
  sensitiveEndpointLimiter 
} = require('../middleware/rateLimiter');
const { cacheMiddleware, invalidateCache } = require('../middleware/cacheMiddleware');
const { protect, optionalAuth } = require('../middleware/auth');
const authorizeResource = require('../middleware/authorize');
const Post = require('../models/Post');
const {
  validatePostCreation,
  validatePostUpdate,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');

const router = express.Router();

// Helper to fetch post for authorization
const fetchPost = async (id) => await Post.findById(id);

// --- Public Routes ---
router.get('/popular', 
  optionalAuth, 
  searchRateLimiter, // Layer 5: Search
  cacheMiddleware(300), // Cache for 5 minutes
  validatePagination, 
  getPopularPosts
);

// --- Protected Routes ---
router.use(protect);
router.use(userRateLimiter); // Layer 2: User-Based

// GET Posts with Caching
router.get('/', 
  searchRateLimiter, 
  cacheMiddleware(60), // Cache for 1 minute
  validatePagination, 
  getPosts
);

router.post('/', 
  writeRateLimiter, // Layer 4: Write-Based
  invalidateCache('/api/posts'), // Invalidate cache on new post
  validatePostCreation, 
  createPost
);

router.get('/user/:userId', 
  validateObjectId('userId'), 
  cacheMiddleware(60),
  validatePagination, 
  getUserPosts
);

router.get('/:id', 
  validateObjectId('id'), 
  cacheMiddleware(300),
  getPost
);

// Resource-Based Authorization + Write Limiting + Invalidation
router.put('/:id', 
  validateObjectId('id'), 
  writeRateLimiter,
  authorizeResource(fetchPost, 'user'), 
  invalidateCache('/api/posts'),
  validatePostUpdate, 
  updatePost
);

router.delete('/:id', 
  validateObjectId('id'), 
  sensitiveEndpointLimiter, // Layer 6: Sensitive
  authorizeResource(fetchPost, 'user'), 
  invalidateCache('/api/posts'),
  deletePost
);

router.post('/:id/like', 
  writeRateLimiter,
  invalidateCache('/api/posts'), // Simple invalidation for all posts cache
  validateObjectId('id'), 
  likePost
);

module.exports = router;
