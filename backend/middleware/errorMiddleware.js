const errorHandler = (err, req, res, next) => {
  // If headers are already sent, delegate to standard Express handler
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    return res.status(409).json({
      error: 'Conflict Error',
      message: fields.length
        ? `A record with this ${fields.join(', ')} already exists.`
        : 'A duplicate record already exists.'
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found. Invalid ID format.'
    });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((item) => item.message)
      .join(' ');

    return res.status(400).json({
      error: 'Validation Error',
      message: message || err.message
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('[ERROR HANDLER]', err.stack || err);

  res.status(statusCode).json({
    error: err.name || 'Server Error',
    message: err.message || 'An unexpected server error occurred.',
    // Only output stack trace details in non-production builds
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };
