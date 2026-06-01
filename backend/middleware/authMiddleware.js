const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split the Bearer token string
      token = req.headers.authorization.split(' ')[1];

      // Verify the signed token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user object and attach it to req.user (excluding passwordHash)
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'The user account associated with this token no longer exists.'
        });
      }

      return next();
    } catch (error) {
      console.error(`JWT Auth Error: ${error.message}`);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Your authorization token is invalid or has expired.'
      });
    }
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Access denied. No authorization Bearer token was provided in headers.'
  });
};

module.exports = { protect };
