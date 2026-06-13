import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  type: { type: String, enum: ['cafe', 'roaster'], required: true },
  refId: { type: String, required: true },   // cafeId or roaster name
  refName: { type: String, required: true }, // human-readable label
  sessionId: { type: String, required: true },
}, { timestamps: true });

favouriteSchema.index({ sessionId: 1, type: 1, refId: 1 }, { unique: true });
favouriteSchema.index({ type: 1, refId: 1 });

export const Favourite = mongoose.model('Favourite', favouriteSchema);
export default Favourite;
