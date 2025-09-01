import mongoose from 'mongoose';

// Middleware to validate ObjectId parameters
export const validateObjectId =
  (paramName = 'id') =>
  (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format`,
      });
    }

    next();
  };
