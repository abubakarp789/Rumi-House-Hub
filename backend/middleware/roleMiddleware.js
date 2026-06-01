const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Your account role (${req.user ? req.user.role : 'anonymous'}) does not have permission to execute this operation.`
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
