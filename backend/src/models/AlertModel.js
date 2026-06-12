import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, maxlength: 500 },
    severity: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
