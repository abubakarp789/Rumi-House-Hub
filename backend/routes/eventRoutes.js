const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEventProposal, 
  updateEventStatus, 
  rsvpEvent, 
  getEventQr 
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public read schedule feeds
router.get('/', getEvents);
router.get('/:id', getEventById);

// Executive/Admin proposed events creation
router.post('/', protect, authorizeRoles('executive', 'admin'), createEventProposal);

// Admin-only event status approvals
router.patch('/:id/status', protect, authorizeRoles('admin'), updateEventStatus);

// Student-only event RSVPs
router.post('/:id/rsvp', protect, authorizeRoles('student'), rsvpEvent);

// Protected dynamic event QR generation pass
router.get('/:id/qr', protect, getEventQr);

module.exports = router;
