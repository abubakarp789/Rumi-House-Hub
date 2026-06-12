const mongoose = require('mongoose');

const RSVPSchema = new mongoose.Schema({
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
  status: { 
    type: String, 
    enum: ['going', 'interested', 'cancelled'], 
    default: 'going' 
  },
  passToken: {
    type: String,
    unique: true,
    sparse: true,
    select: false
  }
}, { timestamps: true });

// Compound unique index blocks duplicate RSVPs
RSVPSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', RSVPSchema);
