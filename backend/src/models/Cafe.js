import mongoose from "mongoose";

const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    hasMultipleLocations: {
      type: Boolean,
      default: false,
    },
    locations: [
      {
        address: {
          type: String,
          required: true,
        },
        neighborhood: {
          type: String,
          required: true,
        },
        coordinates: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
        locationNote: {
          type: String,
          required: false,
        },
        isMainLocation: {
          type: Boolean,
          default: false,
        },
      },
    ],
    description: {
      type: String,
      maxlength: 1000,
    },
    category: [
      {
        type: String,
        required: true,
        enum: ["specialty", "roaster", "thirdwave"],
      },
    ],
    features: [
      {
        type: String,
        enum: [
          "outdoor_seating",
          "wheelchair_accessible",
          "lunch",
          "pour_over",
          "takeaway",
          "vegan_options",
          "breakfast",
          "iced_drinks",
          "pastries",
          "multi_roaster",
          "decaf",
          "no_coffee_bar",
          "limited_sitting",
        ],
      },
    ],
    images: [String],
    isApproved: {
      type: Boolean,
      default: false,
    },
    isSeeded: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

cafeSchema.index({ "locations.coordinates": "2dsphere" });

// Export both models using the same schema but different collections
export const Cafe = mongoose.model("Cafe", cafeSchema, "cafes");
export const CafeSubmission = mongoose.model(
  "CafeSubmission",
  cafeSchema,
  "cafesubmissions"
);
