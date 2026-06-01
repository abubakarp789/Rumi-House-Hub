const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const NewsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Article title is required'],
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  summary: { 
    type: String, 
    required: [true, 'Brief summary is required'] 
  },
  content: { 
    type: String, 
    required: [true, 'Article body content is required'] 
  },
  category: { 
    type: String, 
    enum: ['newsletter', 'alert', 'visit'], 
    default: 'newsletter' 
  },
  publishedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'published' 
  },
  publishedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Auto slugify on validation
NewsSchema.pre('validate', function(next) {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title);
  }
  next();
});

NewsSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('News', NewsSchema);
