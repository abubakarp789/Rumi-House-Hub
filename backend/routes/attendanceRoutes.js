const express = require('express');
const router = express.Router();
const { recordCheckIn, getEventAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Student self-checkin endpoint
router.post('/:id/checkin', protect, authorizeRoles('student'), recordCheckIn);

// Admin/Executive sheet view rosters
router.get('/:id/attendance', protect, authorizeRoles('admin', 'executive'), getEventAttendance);

module.exports = router;
