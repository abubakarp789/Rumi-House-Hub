const Society = require('../models/Society');
const Membership = require('../models/Membership');

// @desc    Get all societies (supports category filter)
// @route   GET /api/societies
// @access  Public
const getSocieties = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = category.toLowerCase().trim();
    }

    const societies = await Society.find(query).populate('executiveBody.userId', 'name email');
    res.json(societies);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single society by ID
// @route   GET /api/societies/:id
// @access  Public
const getSocietyById = async (req, res, next) => {
  try {
    const society = await Society.findById(req.params.id).populate('executiveBody.userId', 'name email');
    
    if (!society) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Society with ID ${req.params.id} does not exist.`
      });
    }

    res.json(society);
  } catch (error) {
    // Graceful ID cast error handling
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Society not found. Invalid ID format.' });
    }
    next(error);
  }
};

// @desc    Create a new society
// @route   POST /api/societies
// @access  Private/Admin
const createSociety = async (req, res, next) => {
  try {
    const { name, description, patronName, facultyCoordinator, category, executiveBody } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Society name is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Description is required.' });
    }

    if (!patronName || !patronName.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Faculty Patron name is required.' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Validation Error', message: 'Category is required.' });
    }

    const nameExists = await Society.findOne({ name: name.trim() });
    if (nameExists) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A society with this name already exists.' });
    }

    const society = await Society.create({
      name: name.trim(),
      description: description.trim(),
      patronName: patronName.trim(),
      facultyCoordinator: facultyCoordinator ? facultyCoordinator.trim() : 'Society Coordinator',
      category: category.toLowerCase().trim(),
      executiveBody: executiveBody || []
    });

    res.status(201).json({
      success: true,
      message: 'Society created successfully!',
      society
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to join a society
// @route   POST /api/societies/:id/join
// @access  Private/Student
const joinSociety = async (req, res, next) => {
  try {
    const societyId = req.params.id;
    const userId = req.user._id;

    // Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Not Found', message: 'Society not found.' });
    }

    // Check for existing membership requests (student can only apply once)
    const existingMembership = await Membership.findOne({ userId, societyId });
    if (existingMembership) {
      return res.status(409).json({ 
        error: 'Conflict Error', 
        message: `A duplicate join request has already been submitted for this society. Current status: ${existingMembership.status}.` 
      });
    }

    // Create a new pending membership request
    const membership = await Membership.create({
      userId,
      societyId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Membership request submitted successfully! Pending approval from Rumi Admin.',
      membership
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Society not found. Invalid ID format.' });
    }
    // Handle database unique key constraints
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A join request has already been submitted.' });
    }
    next(error);
  }
};

// @desc    Moderate membership application status (approve/reject)
// @route   PATCH /api/societies/:id/memberships/:membershipId/status
// @access  Private/Admin
const updateMembershipStatus = async (req, res, next) => {
  try {
    const { id: societyId, membershipId } = req.params;
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Status must be approved or rejected.' });
    }

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({ error: 'Not Found', message: 'Membership record not found.' });
    }

    // Validate membership belongs to this society to prevent cross-society manipulation
    if (membership.societyId.toString() !== societyId) {
      return res.status(403).json({ error: 'Forbidden', message: 'This membership does not belong to the specified society.' });
    }

    if (membership.status === status) {
      return res.status(400).json({ error: 'Validation Error', message: `Membership request is already marked as ${status}.` });
    }

    membership.status = status;
    
    if (status === 'approved') {
      membership.joinedAt = new Date();
    } else {
      membership.joinedAt = undefined;
    }

    await membership.save();

    // Recalculate from source records so concurrent moderation cannot drift the counter.
    const memberCount = await Membership.countDocuments({ societyId, status: 'approved' });
    await Society.updateOne({ _id: societyId }, { $set: { memberCount } });

    res.json({
      success: true,
      message: `Membership successfully marked as ${status}.`,
      membership
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending membership requests
// @route   GET /api/societies/memberships/all
// @access  Private/Admin
const getAllMemberships = async (req, res, next) => {
  try {
    const list = await Membership.find({ status: 'pending' })
      .populate('userId', 'name email registrationNumber department')
      .populate('societyId', 'name');
    res.json(list);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSocieties,
  getSocietyById,
  createSociety,
  joinSociety,
  updateMembershipStatus,
  getAllMemberships
};
