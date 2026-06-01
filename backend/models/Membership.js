const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  societyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Society', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  joinedAt: { 
    type: Date 
  }
}, { timestamps: true });

// A user can apply for membership in a society only once
MembershipSchema.index({ userId: 1, societyId: 1 }, { unique: true });

module.exports = mongoose.model('Membership', MembershipSchema);
