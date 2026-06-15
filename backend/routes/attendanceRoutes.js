const express = require('express');
const router = express.Router();
const { deleteAttendance, recordOrganizerCheckIn, getEventAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Organizer check-in accepts a student's individual event pass.
router.post('/:id/attendance/checkin', protect, authorizeRoles('admin', 'executive'), recordOrganizerCheckIn);

// Admin/Executive sheet view rosters
router.get('/:id/attendance', protect, authorizeRoles('admin', 'executive'), getEventAttendance);
router.delete('/:id/attendance/:attendanceId', protect, authorizeRoles('admin', 'executive'), deleteAttendance);

module.exports = router;
