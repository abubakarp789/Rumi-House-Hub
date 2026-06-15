const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h' // Enforces a 24-hour token expiration limit
  });
};

module.exports = generateToken;
