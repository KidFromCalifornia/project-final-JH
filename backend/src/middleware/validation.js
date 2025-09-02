// Simple email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate registration data
export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 5 || username.length > 20) {
    return res.status(400).json({
      success: false,
      error: 'Username must be 5-20 characters',
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters',
    });
  }

  next();
};

// Validate login data
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required',
    });
  }

  next();
};
