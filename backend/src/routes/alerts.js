import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Alert } from '../models/AlertModel.js';

const router = express.Router();

// Public — get active alerts
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const alerts = await Alert.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
  }
});

// Admin — get all alerts
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
  }
});

// Admin — create alert
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Bad request' : error.message });
  }
});

// Admin — update alert
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Bad request' : error.message });
  }
});

// Admin — delete alert
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
  }
});

export default router;
