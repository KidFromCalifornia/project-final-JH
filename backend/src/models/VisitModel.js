import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  page: { type: String, required: true },
  device: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
  referrer: { type: String, default: '' },
}, { timestamps: true });

visitSchema.index({ createdAt: -1 });
visitSchema.index({ page: 1, createdAt: -1 });

export const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
