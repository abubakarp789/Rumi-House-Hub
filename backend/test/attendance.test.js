const test = require('node:test');
const assert = require('node:assert/strict');

const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const Attendance = require('../models/Attendance');
const { recordOrganizerCheckIn } = require('../controllers/attendanceController');

test('recordOrganizerCheckIn blocks check-in for non-approved events', async (t) => {
  const originalFindById = Event.findById;
  Event.findById = async () => ({
    _id: 'event-1',
    status: 'pendingApproval',
    startDateTime: new Date(),
    endDateTime: new Date(),
    createdBy: 'user-admin'
  });

  const req = {
    params: { id: 'event-1' },
    user: { _id: 'user-admin', role: 'admin' },
    body: { token: 'pass_token123' }
  };

  let statusCalled = null;
  let jsonCalled = null;

  const res = {
    status(code) {
      statusCalled = code;
      return this;
    },
    json(data) {
      jsonCalled = data;
      return this;
    }
  };

  try {
    await recordOrganizerCheckIn(req, res, () => {});
    assert.equal(statusCalled, 400);
    assert.equal(jsonCalled.error, 'Validation Error');
    assert.match(jsonCalled.message, /only allowed for approved events/);
  } finally {
    Event.findById = originalFindById;
  }
});

test('recordOrganizerCheckIn blocks check-in outside the time window', async (t) => {
  const originalFindById = Event.findById;
  
  // Event starts 48 hours in the future
  const eventStart = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);

  Event.findById = async () => ({
    _id: 'event-1',
    status: 'approved',
    startDateTime: eventStart,
    endDateTime: eventEnd,
    createdBy: 'user-admin'
  });

  const req = {
    params: { id: 'event-1' },
    user: { _id: 'user-admin', role: 'admin' },
    body: { token: 'pass_token123' }
  };

  let statusCalled = null;
  let jsonCalled = null;

  const res = {
    status(code) {
      statusCalled = code;
      return this;
    },
    json(data) {
      jsonCalled = data;
      return this;
    }
  };

  try {
    await recordOrganizerCheckIn(req, res, () => {});
    assert.equal(statusCalled, 400);
    assert.equal(jsonCalled.error, 'Validation Error');
    assert.match(jsonCalled.message, /only allowed within the event time window/);
  } finally {
    Event.findById = originalFindById;
  }
});

test('recordOrganizerCheckIn allows check-in within the time window if RSVP is valid', async (t) => {
  const originalFindById = Event.findById;
  const originalFindOneRSVP = RSVP.findOne;
  const originalCreateAttendance = Attendance.create;

  const eventStart = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
  const eventEnd = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour later

  Event.findById = async () => ({
    _id: 'event-1',
    status: 'approved',
    startDateTime: eventStart,
    endDateTime: eventEnd,
    createdBy: 'user-admin'
  });

  RSVP.findOne = () => ({
    select() {
      return {
        _id: 'rsvp-1',
        eventId: 'event-1',
        userId: 'student-1',
        passToken: 'pass_token123'
      };
    }
  });

  let attendanceCreated = false;
  Attendance.create = async () => {
    attendanceCreated = true;
    return {
      _id: 'attendance-1',
      eventId: 'event-1',
      userId: 'student-1',
      checkInTime: new Date(),
      checkInMethod: 'qr'
    };
  };

  const req = {
    params: { id: 'event-1' },
    user: { _id: 'user-admin', role: 'admin' },
    body: { token: 'pass_token123' }
  };

  let statusCalled = null;
  let jsonCalled = null;

  const res = {
    status(code) {
      statusCalled = code;
      return this;
    },
    json(data) {
      jsonCalled = data;
      return this;
    }
  };

  try {
    await recordOrganizerCheckIn(req, res, () => {});
    assert.equal(statusCalled, 201);
    assert.equal(attendanceCreated, true);
    assert.equal(jsonCalled.success, true);
  } finally {
    Event.findById = originalFindById;
    RSVP.findOne = originalFindOneRSVP;
    Attendance.create = originalCreateAttendance;
  }
});
