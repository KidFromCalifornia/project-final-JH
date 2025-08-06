import mongoose from "mongoose";

const coffeeTastingSchema = new mongoose.Schema(
  {
    userId: {
      // Changed from 'user' to 'userId'
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cafeId: {
      // Changed from 'cafe' to 'cafeId'
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
    },
    coffeeOrigin: {
      type: String,
      required: true,
    },
    coffeeOriginRegion: {
      type: String,
      required: true,
    },
    coffeeName: {
      type: String,
      required: true,
    },
    roastLevel: {
      type: String,
      enum: ["light", "medium", "dark"],
      required: true,
    },
    drinkType: {
      type: String,
      enum: ["espresso", "filtered coffee", "pour over", "other"],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    tastingNotes: [
      {
        type: String,
        enum: [
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
        ],
      },
    ],
    acidity: {
      type: String,
      enum: ["light", "medium", "high"],
    },
    mouthFeel: {
      type: String,
      enum: ["light", "medium", "full"],
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    isPublic: {
      type: Boolean,
      default: true, // Default to public for community engagement
    },
    isSeeded: {
      type: Boolean,
      default: false, // Real user data defaults to false
    },
  },
  {
    timestamps: true,
  }
);

export const CoffeeTasting = mongoose.model(
  "CoffeeTasting",
  coffeeTastingSchema
);
