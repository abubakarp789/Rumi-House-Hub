const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { safeTokenEquals } = require('../utils/secureTokens');

// @desc    Record event attendance via token check-in (Student self-checkin)
// @route   POST /api/events/:id/checkin
// @access  Private/Student
const recordCheckIn = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Validation Error', message: 'Attendance verification token is required.' });
    }

    // 1. Fetch the Event document
    const event = await Event.findById(eventId).select('+qrCodeToken');
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ error: 'Validation Error', message: 'Attendance checks are disabled for unapproved events.' });
    }

    // 2. Validate token against the event's qrCodeToken
    if (!safeTokenEquals(event.qrCodeToken, token)) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Invalid attendance token. Verification failed.' 
      });
    }

    // 3. Verify student has a valid RSVP for this event
    const hasRsvp = await RSVP.findOne({ eventId, userId, status: 'going' });
    if (!hasRsvp) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Attendance registration failed. You must RSVP to this event before checking in.'
      });
    }

    // 4. Enforce duplication blocks
    const alreadyCheckedIn = await Attendance.findOne({ eventId, userId });
    if (alreadyCheckedIn) {
      return res.status(409).json({ 
        error: 'Conflict Error', 
        message: 'Attendance verification failed. You have already checked in to this event.' 
      });
    }

    // 4. Create the attendance record
    const attendance = await Attendance.create({
      eventId,
      userId,
      checkInTime: new Date(),
      checkInMethod: 'qr'
    });

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully! Welcome to the event.',
      attendance
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Conflict Error', message: 'Duplicate attendance record detected.' });
    }
    next(error);
  }
};

// @desc    Retrieve complete attendance roster sheets (Admin only)
// @route   GET /api/events/:id/attendance
// @access  Private/Admin (or Executive)
const getEventAttendance = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    // Retrieve attendance sheets, populating user details
    const attendanceRecords = await Attendance.find({ eventId })
      .populate('userId', 'name email registrationNumber department batch')
      .sort({ checkInTime: 1 });

    res.json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordCheckIn,
  getEventAttendance
};
