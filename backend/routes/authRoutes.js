const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected session profiles
router.get('/me', protect, getUserProfile);

// Admin user management
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.patch('/users/:id/role', protect, authorizeRoles('admin'), updateUserRole);

module.exports = router;
