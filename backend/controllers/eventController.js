const QRCode = require('qrcode');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const Society = require('../models/Society');
const { canManageEvent, canProposeForSociety, canReadEventFilter, isPublicEvent } = require('../utils/accessPolicies');
const { createPassToken, createQrCodeToken } = require('../utils/secureTokens');

const EVENT_STATUSES = ['draft', 'pendingApproval', 'approved', 'rejected', 'past'];
const EVENT_POPULATE = [
  { path: 'societyId', select: 'name category slug patronName facultyCoordinator' },
  { path: 'createdBy', select: 'name email role' }
];

const buildEventQuery = (status) => {
  const now = new Date();
  if (!status || status === 'upcoming') return { status: 'approved', startDateTime: { $gte: now } };
  if (status === 'past') {
    return { $or: [{ status: 'past' }, { status: 'approved', startDateTime: { $lt: now } }] };
  }
  if (status === 'all') return {};
  return { status };
};

const withAttendanceCounts = async (events) => Promise.all(events.map(async (event) => {
  const result = event.toObject();
  result.attendeeCount = await Attendance.countDocuments({ eventId: event._id });
  return result;
}));

const getEvents = async (req, res, next) => {
  try {
    const status = String(req.query.status || '').trim();
    if (status && status !== 'all' && status !== 'upcoming' && !EVENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Invalid event status filter.' });
    }
    if (!canReadEventFilter(req.user, status)) {
      return res.status(403).json({ error: 'Forbidden', message: 'This event filter is limited to organizers.' });
    }

    const query = buildEventQuery(status);
    if (req.user?.role === 'executive' && !['', 'approved', 'upcoming', 'past'].includes(status)) {
      query.createdBy = req.user._id;
    }
    const events = await Event.find(query)
      .populate(EVENT_POPULATE)
      .sort({ startDateTime: 1 });
    return res.json(await withAttendanceCounts(events));
  } catch (error) {
    return next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(EVENT_POPULATE);
    if (!event || (!isPublicEvent(event) && !canManageEvent(req.user, event))) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }
    const [result] = await withAttendanceCounts([event]);
    return res.json(result);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found. Invalid ID format.' });
    }
    return next(error);
  }
};

const createEventProposal = async (req, res, next) => {
  try {
    const { societyId, title, description, type, location, startDateTime, endDateTime, capacity } = req.body;
    const parsedCapacity = Number.parseInt(capacity, 10);
    if (!societyId) return res.status(400).json({ error: 'Validation Error', message: 'Hosting society ID is required.' });
    if (!title?.trim()) return res.status(400).json({ error: 'Validation Error', message: 'Event title is required.' });
    if (!description?.trim()) return res.status(400).json({ error: 'Validation Error', message: 'Event description is required.' });
    if (!['seminar', 'workshop', 'competition', 'sports'].includes(type)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid event type is required.' });
    }
    if (!location?.trim()) return res.status(400).json({ error: 'Validation Error', message: 'Venue location is required.' });
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      return res.status(400).json({ error: 'Validation Error', message: 'Capacity must be a positive number.' });
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Validation Error', message: 'Event end date and time must be after a valid start date and time.' });
    }

    const society = await Society.findById(societyId);
    if (!society) return res.status(404).json({ error: 'Not Found', message: 'Hosting society not found.' });
    if (!canProposeForSociety(req.user, society)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only propose events for a society you lead.' });
    }

    const event = await Event.create({
      societyId,
      title: title.trim(),
      description: description.trim(),
      type,
      location: location.trim(),
      startDateTime: start,
      endDateTime: end,
      capacity: parsedCapacity,
      status: 'pendingApproval',
      qrCodeToken: createQrCodeToken(),
      createdBy: req.user._id
    });
    return res.status(201).json({ success: true, message: 'Event proposed successfully and sent for approval.', event });
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    if (!canManageEvent(req.user, event)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You are not authorized to edit this event.' });
    }
    if (req.user.role === 'executive' && ['approved', 'past'].includes(event.status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Approved or past events cannot be edited by executives.' });
    }

    const proposed = {
      societyId: req.body.societyId || event.societyId,
      title: req.body.title ?? event.title,
      description: req.body.description ?? event.description,
      type: req.body.type ?? event.type,
      location: req.body.location ?? event.location,
      startDateTime: req.body.startDateTime ?? event.startDateTime,
      endDateTime: req.body.endDateTime ?? event.endDateTime,
      capacity: req.body.capacity ?? event.capacity
    };
    const capacity = Number.parseInt(proposed.capacity, 10);
    const start = new Date(proposed.startDateTime);
    const end = new Date(proposed.endDateTime);

    if (!String(proposed.title).trim() || !String(proposed.description).trim() || !String(proposed.location).trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Title, description, and location are required.' });
    }
    if (!['seminar', 'workshop', 'competition', 'sports'].includes(proposed.type)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid event type is required.' });
    }
    if (!Number.isInteger(capacity) || capacity < 1 || capacity < event.registered) {
      return res.status(400).json({ error: 'Validation Error', message: 'Capacity must cover all existing registrations.' });
    }
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Validation Error', message: 'Event end date and time must be after the start.' });
    }

    const society = await Society.findById(proposed.societyId);
    if (!society) return res.status(404).json({ error: 'Not Found', message: 'Hosting society not found.' });
    if (!canProposeForSociety(req.user, society)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only assign events to a society you lead.' });
    }

    event.societyId = society._id;
    event.title = String(proposed.title).trim();
    event.description = String(proposed.description).trim();
    event.type = proposed.type;
    event.location = String(proposed.location).trim();
    event.startDateTime = start;
    event.endDateTime = end;
    event.capacity = capacity;
    if (req.user.role === 'executive') event.status = 'pendingApproval';
    event.rejectionReason = undefined;
    await event.save();

    return res.json({ success: true, message: 'Event updated successfully.', event });
  } catch (error) {
    return next(error);
  }
};

const VALID_TRANSITIONS = {
  draft: ['pendingApproval'],
  pendingApproval: ['approved', 'rejected'],
  approved: ['past'],
  rejected: ['pendingApproval'],
  past: [],
};

const updateEventStatus = async (req, res, next) => {
  try {
    const status = String(req.body.status || '').trim();
    if (!EVENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid status is required.' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });

    const allowed = VALID_TRANSITIONS[event.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Cannot transition from '${event.status}' to '${status}'.`
      });
    }

    event.status = status;
    if (status === 'rejected') {
      event.rejectionReason = String(req.body.rejectionReason || '').trim() || undefined;
    }
    await event.save();
    return res.json({ success: true, message: `Event status updated to ${status}.`, event });
  } catch (error) {
    return next(error);
  }
};

const rsvpEvent = async (req, res, next) => {
  let rsvp;
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const event = await Event.findOneAndUpdate(
      { _id: eventId, status: 'approved', registered: { $lt: 1e9 } },
      { $inc: { registered: 0 } },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Not Found', message: 'Approved event not found.' });
    if (event.registered >= event.capacity) {
      return res.status(409).json({ error: 'Capacity Error', message: 'This event has reached capacity.' });
    }

    rsvp = await RSVP.create({ eventId, userId, status: 'going', passToken: createPassToken() });
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, registered: { $lt: event.capacity } },
      { $inc: { registered: 1 } },
      { new: true }
    );
    if (!updatedEvent) {
      await RSVP.deleteOne({ _id: rsvp._id });
      return res.status(409).json({ error: 'Capacity Error', message: 'This event has reached capacity.' });
    }
    return res.status(201).json({
      success: true,
      message: 'RSVP submitted successfully.',
      rsvp: { _id: rsvp._id, eventId: rsvp.eventId, userId: rsvp.userId, status: rsvp.status },
      registered: updatedEvent.registered,
      capacity: updatedEvent.capacity
    });
  } catch (error) {
    if (rsvp?._id) await RSVP.deleteOne({ _id: rsvp._id });
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A duplicate RSVP already exists.' });
    }
    return next(error);
  }
};

const cancelRsvp = async (req, res, next) => {
  try {
    const attended = await Attendance.exists({ eventId: req.params.id, userId: req.user._id });
    if (attended) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A checked-in event pass cannot be cancelled.' });
    }
    const rsvp = await RSVP.findOneAndDelete({ eventId: req.params.id, userId: req.user._id });
    if (!rsvp) return res.status(404).json({ error: 'Not Found', message: 'RSVP not found.' });

    await Event.updateOne({ _id: req.params.id, registered: { $gt: 0 } }, { $inc: { registered: -1 } });
    return res.json({ success: true, message: 'RSVP cancelled successfully.' });
  } catch (error) {
    return next(error);
  }
};

const getEventQr = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !isPublicEvent(event)) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }
    const rsvp = await RSVP.findOne({ eventId: event._id, userId: req.user._id, status: 'going' }).select('+passToken');
    if (!rsvp) {
      return res.status(403).json({ error: 'Forbidden', message: 'RSVP to this event before requesting a pass.' });
    }
    if (!rsvp.passToken) {
      rsvp.passToken = createPassToken();
      await rsvp.save();
    }
    const payload = JSON.stringify({ eventId: String(event._id), passToken: rsvp.passToken });
    const qrUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 1, width: 320 });
    return res.json({
      eventId: event._id,
      qrUrl,
      passId: rsvp.passToken.slice(-8).toUpperCase(),
      message: 'Present this individual pass to an event organizer.'
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete an event proposal (Admin or Creator Executive only)
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    // Access policy check
    if (!canManageEvent(req.user, event)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You are not authorized to delete this event.' });
    }

    // Executive constraint: cannot delete approved/past events
    if (req.user.role === 'executive' && ['approved', 'past'].includes(event.status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Executives cannot delete events that have already been approved or have passed.'
      });
    }

    // Clean up cascade: delete all associated RSVPs and Attendance
    await RSVP.deleteMany({ eventId: event._id });
    await Attendance.deleteMany({ eventId: event._id });

    // Delete the event
    await Event.findByIdAndDelete(event._id);

    return res.json({
      success: true,
      message: 'Event proposal and all associated reservation records deleted successfully.'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found. Invalid ID format.' });
    }
    return next(error);
  }
};

module.exports = { 
  createEventProposal, 
  updateEvent,
  getEventById, 
  getEventQr, 
  getEvents, 
  rsvpEvent, 
  cancelRsvp,
  updateEventStatus,
  deleteEvent
};
