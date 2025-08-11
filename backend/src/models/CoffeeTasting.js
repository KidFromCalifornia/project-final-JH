import mongoose from "mongoose";

const coffeeTastingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
    },
    cafeNeighborhood: {
      type: String,
      required: false,
    },
    coffeeRoaster: {
      type: String,
      required: false,
    },
    coffeeOrigin: {
      type: String,
      required: false,
    },
    coffeeOriginRegion: {
      type: String,
      required: false,
    },
    coffeeName: {
      type: String,
      required: true,
    },
    coffeeNeightborhood: {
      type: String,
      required: false,
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
      default: true,
    },
    isSeeded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

coffeeTastingSchema.index({
  coffeeName: "text",
  notes: "text",
  coffeeOrigin: "text",
  coffeeRoaster: "text",
  coffeeOriginRegion: "text",
});

export const CoffeeTasting = mongoose.model(
  "CoffeeTasting",
  coffeeTastingSchema
);
