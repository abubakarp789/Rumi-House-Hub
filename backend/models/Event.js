const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  societyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Society', 
    required: [true, 'Hosting society reference is required'] 
  },
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Event description is required'] 
  },
  type: { 
    type: String, 
    enum: ['seminar', 'workshop', 'competition', 'sports'], 
    required: true 
  },
  location: { 
    type: String, 
    required: [true, 'Venue location is required'],
    trim: true 
  },
  startDateTime: { 
    type: Date, 
    required: [true, 'Start date and time are required'] 
  },
  endDateTime: { 
    type: Date, 
    required: [true, 'End date and time are required'] 
  },
  capacity: { 
    type: Number, 
    required: [true, 'Total event capacity is required'],
    min: [1, 'Capacity must be at least 1'] 
  },
  registered: {
    type: Number,
    default: 0,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['draft', 'pendingApproval', 'approved', 'rejected', 'past'], 
    default: 'pendingApproval' 
  },
  qrCodeToken: { 
    type: String, 
    required: true,
    unique: true,
    select: false
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

EventSchema.pre('validate', function(next) {
  if (this.startDateTime && this.endDateTime && this.endDateTime <= this.startDateTime) {
    this.invalidate('endDateTime', 'End date and time must be after the start date and time.');
  }

  if (this.registered > this.capacity) {
    this.invalidate('registered', 'Registered seats cannot exceed event capacity.');
  }

  next();
});

EventSchema.index({ status: 1, startDateTime: 1 });
EventSchema.index({ societyId: 1, startDateTime: 1 });

module.exports = mongoose.model('Event', EventSchema);
