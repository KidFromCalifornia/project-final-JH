import mongoose from "mongoose";

const cafeSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    // Updated to match Cafe schema
    category: [
      {
        type: String,
        enum: ["specialty", "roaster", "Thirdwave"],
      },
    ],
    // Updated to match Cafe schema
    features: [
      {
        type: String,
        enum: [
          "wifi",
          "outdoor_seating",
          "wheelchair_accessible",
          "lunch",
          "pour_over",
          "takeaway",
          "vegan_options",
          "breakfast",
          "iced_drinks",
          "sweets",
          "multi_roaster",
          "indoor_seating",
          "decaf",
        ],
      },
    ],
    // Optional fields that users might provide
    images: [String],
    website: String,
    phone: String,

    // Submission workflow fields
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    adminNotes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient admin queries
cafeSubmissionSchema.index({ status: 1, createdAt: -1 });

export const CafeSubmission = mongoose.model(
  "CafeSubmission",
  cafeSubmissionSchema
);
