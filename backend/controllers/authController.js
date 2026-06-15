const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isValidNamalEmail, isValidRegNumber } = require('../utils/validators');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, registrationNumber, department, batch, password } = req.body;

    // 1. Validation checks
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Full name is required.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email address is required.' });
    }

    if (!isValidNamalEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Email must be a valid student address ending with @namal.edu.pk.' 
      });
    }

    if (!registrationNumber || !registrationNumber.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Registration number is required.' });
    }

    if (!isValidRegNumber(registrationNumber)) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Registration number format must follow NUM-DEPT-YYYY-ID (e.g. NUM-BSCS-2022-41).' 
      });
    }

    if (!department || !department.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Department is required.' });
    }

    if (!batch || !batch.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Batch year is required.' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Password is required and must be at least 8 characters long.'
      });
    }

    // Normalize inputs
    const lowercaseEmail = email.toLowerCase().trim();
    const uppercaseReg = registrationNumber.toUpperCase().trim();

    // 2. Check for existing users
    const emailExists = await User.findOne({ email: lowercaseEmail });
    if (emailExists) {
      return res.status(409).json({ 
        error: 'Conflict Error', 
        message: 'A user with this student email address is already registered.' 
      });
    }

    const regExists = await User.findOne({ registrationNumber: uppercaseReg });
    if (regExists) {
      return res.status(409).json({ 
        error: 'Conflict Error', 
        message: 'A user with this registration number is already registered.' 
      });
    }

    // 3. Cryptographically hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create new user document
    const user = await User.create({
      name: name.trim(),
      email: lowercaseEmail,
      registrationNumber: uppercaseReg,
      role: 'student',
      department: department.trim(),
      batch: batch.trim(),
      passwordHash
    });

    if (user) {
      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          registrationNumber: user.registrationNumber,
          role: user.role,
          department: user.department,
          batch: user.batch
        },
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ error: 'Server Error', message: 'Failed to create user account. Invalid data provided.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and generate JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required.' });
    }

    const lowercaseEmail = email.toLowerCase().trim();

    // Find the User document
    const user = await User.findOne({ email: lowercaseEmail });

    const isPasswordCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: 'Auth Error', message: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
        department: user.department,
        batch: user.batch
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // Fetch user memberships and RSVPs relational records to serve the dashboard in one network call
    const Membership = require('../models/Membership');
    const RSVP = require('../models/RSVP');
    const Attendance = require('../models/Attendance');

    const memberships = await Membership.find({ userId: req.user._id }).populate('societyId', 'name category slug');
    const rsvps = await RSVP.find({ userId: req.user._id }).populate({
      path: 'eventId',
      populate: {
        path: 'societyId',
        select: 'name'
      }
    });
    const attendance = await Attendance.find({ userId: req.user._id }).select('eventId');
    const attendedEventIds = new Set(attendance.map((record) => String(record.eventId)));
    const dashboardRsvps = rsvps.map((rsvp) => ({
      ...rsvp.toObject(),
      checkedIn: attendedEventIds.has(String(rsvp.eventId?._id || rsvp.eventId))
    }));

    res.json({
      success: true,
      user: req.user,
      memberships,
      rsvps: dashboardRsvps
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'department', 'batch', 'phone', 'emergencyContact'];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = String(req.body[field] || '').trim();
      }
    }

    for (const requiredField of ['name', 'department', 'batch']) {
      if (Object.prototype.hasOwnProperty.call(updates, requiredField) && !updates[requiredField]) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `${requiredField} cannot be empty.`
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    return res.json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PATCH /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'executive', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Role must be one of: student, executive, admin.' });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: 'Validation Error', message: 'You cannot change your own role.' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'User not found. Invalid ID format.' });
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const Membership = require('../models/Membership');
    const RSVP = require('../models/RSVP');
    const Attendance = require('../models/Attendance');
    const Event = require('../models/Event');
    const Society = require('../models/Society');

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: 'Validation Error', message: 'You cannot delete your own account.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Forbidden', message: 'Administrator accounts are protected from deletion.' });
    }

    const ownedEventCount = await Event.countDocuments({ createdBy: user._id });
    if (ownedEventCount > 0) {
      return res.status(409).json({
        error: 'Conflict Error',
        message: 'Reassign or delete this executive\'s events before deleting the account.'
      });
    }

    const [memberships, rsvps] = await Promise.all([
      Membership.find({ userId: user._id }).select('societyId'),
      RSVP.find({ userId: user._id }).select('eventId')
    ]);

    await Promise.all(rsvps.map((rsvp) => Event.updateOne(
      { _id: rsvp.eventId, registered: { $gt: 0 } },
      { $inc: { registered: -1 } }
    )));
    await Promise.all([
      Attendance.deleteMany({ userId: user._id }),
      RSVP.deleteMany({ userId: user._id }),
      Membership.deleteMany({ userId: user._id }),
      Society.updateMany({}, { $pull: { executiveBody: { userId: user._id } } })
    ]);

    const societyIds = [...new Set(memberships.map((item) => String(item.societyId)))];
    await Promise.all(societyIds.map(async (societyId) => {
      const memberCount = await Membership.countDocuments({ societyId, status: 'approved' });
      await Society.updateOne({ _id: societyId }, { $set: { memberCount } });
    }));

    await User.deleteOne({ _id: user._id });
    return res.json({ success: true, message: 'User account and personal participation records deleted.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
};
