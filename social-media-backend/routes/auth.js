const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getUserById,
  getUsers
} = require('../controllers/authController');
const { authRateLimiter, registerRateLimiter, tenantRateLimiter } = require('../middleware/rateLimiter');

const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', tenantRateLimiter, registerRateLimiter, validateUserRegistration, register);
router.post('/login', tenantRateLimiter, authRateLimiter, validateUserLogin, login);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);
router.put('/change-password', changePassword);
router.delete('/deactivate', deactivateAccount);

// User discovery routes
router.get('/users', validatePagination, getUsers);
router.get('/users/:identifier', getUserById);

module.exports = router;
