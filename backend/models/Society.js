const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const SocietySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Society name is required'], 
    unique: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  patronName: { 
    type: String, 
    required: [true, 'Patron name is required'],
    trim: true 
  },
  facultyCoordinator: { 
    type: String,
    trim: true 
  },
  category: { 
    type: String, 
    enum: ['technical', 'cultural', 'sports', 'social', 'literary', 'arts'], 
    required: true 
  },
  executiveBody: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    position: { 
      type: String, 
      required: true,
      trim: true // e.g. "President", "Executive Lead"
    }
  }],
  memberCount: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Auto-generate slug from name on validation
SocietySchema.pre('validate', function(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = slugify(this.name);
  }
  next();
});

SocietySchema.index({ category: 1, name: 1 });

module.exports = mongoose.model('Society', SocietySchema);
