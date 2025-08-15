import { z } from "zod";

// User registration validation
export const registerSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters").max(20),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 6 characters"),
});

// User login validation
export const loginSchema = z
  .object({
    email: z.string().email("Invalid email format").optional(),
    username: z.string().min(1, "Username is required").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Email or username is required",
  });

export const tastingSchema = z.object({
  cafeId: z.string().min(1, "Cafe ID is required"),
  cafeNeighborhood: z.string().min(),
  coffeeRoaster: z.string().min(),
  coffeeOrigin: z.string().min(),
  coffeeOriginRegion: z.string().min(),
  coffeeName: z.string().min(1, "Coffee name is required"),
  roastLevel: z.enum(["light", "medium", "dark"]),
  brewMethod: z.enum(["espresso", "filtered coffee", "pour over", "other"]),
  rating: z.number().min(1).max(5),
  tastingNotes: z
    .array(
      z.enum([
        "fruity",
        "floral",
        "sweet",
        "nutty",
        "cocoa",
        "spices",
        "roasted",
        "green",
        "sour",
        "other",
      ])
    )
    .optional(),
  acidity: z.enum(["light", "medium", "high"]).optional(),
  mouthFeel: z.enum(["light", "medium", "full"]).optional(),
  notes: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
  };
};
