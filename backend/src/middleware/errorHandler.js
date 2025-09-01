// Global error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);

  // Default error response
  let error = {
    success: false,
    message: err.message || 'Internal server error',
    statusCode: err.statusCode || 500,
  };

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // MongoDB cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
    error.message = 'Internal server error';
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
