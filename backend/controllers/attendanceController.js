const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { canManageEvent } = require('../utils/accessPolicies');
const { safeTokenEquals } = require('../utils/secureTokens');

const extractPassToken = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return JSON.parse(raw).passToken || '';
  } catch {
    return raw;
  }
};

const createAttendance = async (res, eventId, userId, method) => {
  const attendance = await Attendance.create({ eventId, userId, checkInTime: new Date(), checkInMethod: method });
  return res.status(201).json({ success: true, message: 'Attendance recorded successfully.', attendance });
};

const recordOrganizerCheckIn = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    if (!canManageEvent(req.user, event)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only check in attendees for events you manage.' });
    }
    if (event.status !== 'approved') {
      return res.status(400).json({ error: 'Validation Error', message: 'Attendance check-in is only allowed for approved events.' });
    }

    const now = new Date();
    const eventStart = new Date(event.startDateTime);
    const eventEnd = new Date(event.endDateTime);

    // Configurable time window: check-in is allowed from 24 hours before start until 24 hours after end
    const windowStart = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
    const windowEnd = new Date(eventEnd.getTime() + 24 * 60 * 60 * 1000);

    if (now < windowStart || now > windowEnd) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Attendance check-in is only allowed within the event time window (24 hours before start until 24 hours after end).'
      });
    }

    const token = extractPassToken(req.body.token);
    if (!token) return res.status(400).json({ error: 'Validation Error', message: 'A scanned or pasted event pass is required.' });
    const rsvp = await RSVP.findOne({ eventId: event._id, status: 'going', passToken: token }).select('+passToken');
    if (!rsvp || !safeTokenEquals(rsvp.passToken, token)) {
      return res.status(400).json({ error: 'Validation Error', message: 'This pass is invalid for the selected event.' });
    }
    return await createAttendance(res, event._id, rsvp.userId, 'qr');
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Conflict Error', message: 'Attendance is already recorded.' });
    return next(error);
  }
};

const getEventAttendance = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    if (!canManageEvent(req.user, event)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only view attendance for events you manage.' });
    }
    const records = await Attendance.find({ eventId: event._id })
      .populate('userId', 'name email registrationNumber department batch')
      .sort({ checkInTime: 1 });
    return res.json(records);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getEventAttendance, recordOrganizerCheckIn };
