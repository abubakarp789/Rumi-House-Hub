const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\S+@namal\.edu\.pk$/, 'Please use a valid Namal Student Email (@namal.edu.pk)'] 
  },
  registrationNumber: { 
    type: String, 
    required: [true, 'Registration number is required'], 
    unique: true,
    trim: true,
    match: [/^NUM-[A-Z]{3,4}-\d{4}-\d{1,3}$/i, 'Please use a valid registration number format (e.g. NUM-BSCS-2022-41)']
  },
  role: { 
    type: String, 
    enum: {
      values: ['student', 'executive', 'admin'],
      message: '{VALUE} is not a valid user role'
    }, 
    default: 'student' 
  },
  department: { 
    type: String, 
    required: [true, 'Department is required'],
    trim: true
  },
  batch: { 
    type: String, 
    required: [true, 'Batch year is required'],
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password is required'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
