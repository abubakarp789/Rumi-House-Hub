const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEventProposal, 
  updateEvent,
  updateEventStatus, 
  rsvpEvent, 
  cancelRsvp,
  getEventQr,
  deleteEvent
} = require('../controllers/eventController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public read schedule feeds
router.get('/', optionalProtect, getEvents);
router.get('/:id', optionalProtect, getEventById);

// Executive/Admin proposed events creation
router.post('/', protect, authorizeRoles('executive', 'admin'), createEventProposal);
router.patch('/:id', protect, authorizeRoles('executive', 'admin'), updateEvent);

// Admin-only event status approvals
router.patch('/:id/status', protect, authorizeRoles('admin'), updateEventStatus);

// Student-only event RSVPs
router.post('/:id/rsvp', protect, authorizeRoles('student'), rsvpEvent);
router.delete('/:id/rsvp', protect, authorizeRoles('student'), cancelRsvp);

// Protected dynamic event QR generation pass
router.get('/:id/qr', protect, authorizeRoles('student'), getEventQr);

// Delete event proposal (executive or admin)
router.delete('/:id', protect, authorizeRoles('executive', 'admin'), deleteEvent);

module.exports = router;
