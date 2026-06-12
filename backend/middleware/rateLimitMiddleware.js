const rateLimitStore = {};

const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    const client = rateLimitStore[ip];

    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowMs;
      return next();
    }

    client.count += 1;

    if (client.count > limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Too many authentication attempts from this IP, please try again later.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
