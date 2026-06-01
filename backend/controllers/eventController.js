const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const Society = require('../models/Society');
const { createQrCodeToken } = require('../utils/secureTokens');

const EVENT_STATUSES = ['draft', 'pendingApproval', 'approved', 'rejected', 'past'];

// @desc    Get all events (supports filtering by status)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    // Standard public visitors only see approved events
    // Logged in executives/admins can check draft or pending events via status filter
    // Special case: status=all returns events across all statuses (for executive/admin dashboards)
    if (status) {
      const trimmedStatus = status.trim();
      if (trimmedStatus === 'all') {
        // No status filter — return events across all statuses
      } else if (!EVENT_STATUSES.includes(trimmedStatus)) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid event status filter.' });
      } else {
        query.status = trimmedStatus;
      }
    } else {
      query.status = 'approved';
    }

    const events = await Event.find(query).populate('societyId', 'name category slug');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('societyId', 'name category slug patronName facultyCoordinator');
    
    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Event with ID ${req.params.id} does not exist.`
      });
    }

    res.json(event);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found. Invalid ID format.' });
    }
    next(error);
  }
};

// @desc    Propose a new event (Executive only)
// @route   POST /api/events
// @access  Private/Executive
const createEventProposal = async (req, res, next) => {
  try {
    const { societyId, title, description, type, location, startDateTime, endDateTime, capacity } = req.body;
    const parsedCapacity = Number.parseInt(capacity, 10);

    if (!societyId) {
      return res.status(400).json({ error: 'Validation Error', message: 'Hosting society ID is required.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Event title is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Event description is required.' });
    }

    if (!type || !['seminar', 'workshop', 'competition', 'sports'].includes(type)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid event type is required.' });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Venue location is required.' });
    }

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'Validation Error', message: 'Start and End dates are required.' });
    }

    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      return res.status(400).json({ error: 'Validation Error', message: 'Capacity must be a positive number.' });
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Event end date and time must be after a valid start date and time.'
      });
    }

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Not Found', message: 'Hosting society not found.' });
    }

    // Generate cryptographically strong QR token for the attendance system.
    const qrCodeToken = createQrCodeToken();

    const event = await Event.create({
      societyId,
      title: title.trim(),
      description: description.trim(),
      type,
      location: location.trim(),
      startDateTime: start,
      endDateTime: end,
      capacity: parsedCapacity,
      status: 'pendingApproval', // Defaults to pendingApproval for admins to moderate
      qrCodeToken,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event proposed successfully! Pending approval from Rumi Admin.',
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject event proposal
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res, next) => {
  try {
    const status = req.body.status ? req.body.status.trim() : '';

    if (!status || !EVENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid status is required.' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    event.status = status;
    await event.save();

    res.json({
      success: true,
      message: `Event proposal successfully updated to: ${status}.`,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private/Student
const rsvpEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ error: 'Validation Error', message: 'You can only RSVP to approved events.' });
    }

    const existingRsvp = await RSVP.findOne({ eventId, userId });
    if (existingRsvp) {
      return res.status(409).json({ 
        error: 'Conflict Error', 
        message: 'A duplicate RSVP has already been submitted for this event.' 
      });
    }

    const rsvp = await RSVP.create({
      eventId,
      userId,
      status: 'going'
    });

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, registered: { $lt: event.capacity } },
      { $inc: { registered: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      await RSVP.deleteOne({ _id: rsvp._id });
      return res.status(409).json({
        error: 'Capacity Error',
        message: 'RSVPs are closed. This event has reached its maximum seating capacity.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'RSVP submitted successfully!',
      rsvp,
      registered: updatedEvent.registered,
      capacity: updatedEvent.capacity
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A duplicate RSVP already exists.' });
    }
    next(error);
  }
};

// @desc    Generate event QR code URL pass
// @route   GET /api/events/:id/qr
// @access  Private
const getEventQr = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).select('+qrCodeToken');
    if (!event) {
      return res.status(404).json({ error: 'Not Found', message: 'Event not found.' });
    }

    const qrPayload = `eventId=${event._id}&token=${event.qrCodeToken}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`;

    res.json({
      eventId: event._id,
      qrUrl,
      message: 'Scan at the venue to record attendance.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEventProposal,
  updateEventStatus,
  rsvpEvent,
  getEventQr
};
