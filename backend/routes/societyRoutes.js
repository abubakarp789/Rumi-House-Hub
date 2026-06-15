const express = require('express');
const router = express.Router();
const { 
  getSocieties, 
  getSocietyById, 
  createSociety, 
  updateSociety,
  deleteSociety,
  joinSociety, 
  updateMembershipStatus,
  deleteMembership,
  getAllMemberships
} = require('../controllers/societyController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public read directory endpoints
router.get('/', getSocieties);
router.get('/memberships/all', protect, authorizeRoles('admin'), getAllMemberships);
router.get('/:id', getSocietyById);

// Admin-only creation endpoint
router.post('/', protect, authorizeRoles('admin'), createSociety);
router.patch('/:id', protect, authorizeRoles('admin'), updateSociety);
router.delete('/:id', protect, authorizeRoles('admin'), deleteSociety);

// Student-only joining request
router.post('/:id/join', protect, authorizeRoles('student'), joinSociety);

// Admin-only enrollment moderation approvals
router.patch('/:id/memberships/:membershipId/status', protect, authorizeRoles('admin'), updateMembershipStatus);
router.delete('/:id/memberships/:membershipId', protect, deleteMembership);

module.exports = router;
