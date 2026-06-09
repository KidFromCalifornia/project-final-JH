import mongoose from 'mongoose';

const coffeeTastingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: true,
    },
    cafeNeighborhood: {
      type: String,
      required: false,
    },
    coffeeRoaster: {
      type: String,
      required: true,
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

    roastLevel: {
      type: String,
      enum: ['light', 'medium', 'dark'],
      required: false,
    },
    brewMethod: {
      type: String,
      enum: ['espresso', 'filtered coffee', 'pour over', 'other'],
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
          'fruity',
          'green',
          'sour',
          'roasted',
          'cereal',
          'spices',
          'nutty',
          'cocoa',
          'sweet',
          'alcohol',
          'stale',
          'earthy',
          'chemical',
          'floral',
          'other',
        ],
      },
    ],
    acidity: {
      type: String,
      enum: ['light', 'medium', 'high'],
    },
    mouthFeel: {
      type: String,
      enum: ['mouth drying', 'metallic', 'oily', 'light', 'medium', 'full', 'other'],
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
  coffeeName: 'text',
  notes: 'text',
  coffeeOrigin: 'text',
  coffeeRoaster: 'text',
  coffeeOriginRegion: 'text',
});

export const CoffeeTasting = mongoose.model('CoffeeTasting', coffeeTastingSchema);

export default CoffeeTasting;
