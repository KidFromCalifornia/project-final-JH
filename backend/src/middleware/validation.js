import { z } from 'zod';

// User registration validation
// Simple validation functions (replacing Zod)

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

// User login validation
export const loginSchema = z
  .object({
    email: z.string().email('Invalid email format').optional(),
    username: z.string().min(1, 'Username is required').optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.email || data.username, {
    message: 'Email or username is required',
  });

// Cafe validation: locations should be an array of objects
export const cafeSchema = z.object({
  name: z.string().min(1, 'Cafe name is required'),
  locations: z.array(
    z.object({
      address: z.string().min(1, 'Address is required'),
      isMainLocation: z.boolean().optional(),
      coordinates: z
        .object({
          type: z.literal('Point').optional(),
          coordinates: z.array(z.number()).length(2).optional(), // [longitude, latitude]
        })
        .optional(),
      neighborhood: z.string().optional(),
      locationNote: z.string().optional(),
    })
  ),
  category: z.enum(['specialty', 'roaster', 'thirdwave']),
  features: z.array(
    z.enum([
      'outdoor_seating',
      'wheelchair_accessible',
      'lunch',
      'pour_over',
      'takeaway',
      'vegan_options',
      'breakfast',
      'iced_drinks',
      'pastries',
      'multi_roaster',
      'decaf',
      'no_coffee_bar',
      'limited_sitting',
      'roaster_only',
    ])
  ),
  images: z.array(z.string()).optional(),
  isApproved: z.boolean().optional(),
  isSeeded: z.boolean().optional(),
  description: z.string().max(1000).optional(),
  submittedBy: z.string().optional(),
});

// Example: Add a generic validation middleware
export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};
