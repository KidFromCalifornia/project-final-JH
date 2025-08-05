import mongoose from "mongoose";

const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
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
    category: [
      {
        type: String,
        enum: ["specialty", "roaster", "Thirdwave"],
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
          "fika",
          "Pastries",
          "multi_roaster",
          "indoor_seating",
          "decaf",
        ],
      },
    ],
    images: [String],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

cafeSchema.index({ location: "2dsphere" });

export const Cafe = mongoose.model("Cafe", cafeSchema, "cafes");
