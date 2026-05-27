import mongoose from 'mongoose';

const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      ref: 'Cafe',
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
          required: false,
        },
        coordinates: {
          type: {
            type: String,
            enum: ['Point'],
          },
          coordinates: {
            type: [Number],
            default: undefined,
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
        features: [
          {
            type: String,
            enum: [
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
              'public_transit_nearby',
              'bar_seating',
              'serves_food',
              'no_food',
              'bathroom_available',
              'quiet_environment',
            ],
          },
        ],
      },
    ],
    description: {
      type: String,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['specialty', 'roaster', 'thirdwave'],
    },

    features: [
      {
        type: String,
        enum: [
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
          'public_transit_nearby',
          'bar_seating',
          'serves_food',
          'no_food',
          'bathroom_available',
          'quiet_environment',
        ],
        required: true,
      },
    ],
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    images: [String],
    isApproved: {
      type: Boolean,
      default: false,
      required: false,
    },
    isSeeded: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    parentCafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

cafeSchema.index({ 'locations.coordinates': '2dsphere' }, { sparse: true });

export const Cafe = mongoose.model('Cafe', cafeSchema);
export const CafeSubmission = mongoose.model('CafeSubmission', cafeSchema);
