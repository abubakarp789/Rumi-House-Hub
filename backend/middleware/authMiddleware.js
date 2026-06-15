const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  return User.findById(decoded.id).select('-passwordHash');
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split the Bearer token string
      token = req.headers.authorization.split(' ')[1];

      // Verify the signed token
      req.user = await authenticate(token);

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

const optionalProtect = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    req.user = await authenticate(token);
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'The token user no longer exists.' });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Your authorization token is invalid or has expired.'
    });
  }
};

module.exports = { optionalProtect, protect };
