const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  checkInTime: { 
    type: Date, 
    default: Date.now 
  },
  checkInMethod: { 
    type: String, 
    enum: ['qr', 'code', 'manual'], 
    default: 'qr' 
  }
});

// Enforces one check-in document per student per event
AttendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
