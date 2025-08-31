import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
  username: z.string().min(5, 'Username must be at least 5 characters').max(20),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export const cafeSubmissionSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  hasMultipleLocations: z.boolean().optional(),
  locations: z.array(
    z.object({
      address: z.string().min(1),
      neighborhood: z.string().optional(),
      locationNote: z.string().optional(),
      isMainLocation: z.boolean().optional(),
      coordinates: z
        .object({
          type: z.literal('Point'),
          coordinates: z.array(z.number()).length(2),
        })
        .optional(),
    })
  ),
  description: z.string().max(1000).optional(),
  category: z.enum(['specialty', 'roaster', 'thirdwave']),
  features: z.array(z.string()).min(1),
  images: z.array(z.string()).optional(),
});

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
