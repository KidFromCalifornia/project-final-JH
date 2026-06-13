import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Favourite } from '../models/FavouriteModel.js';

const router = express.Router();

// Toggle save — public, session-based
router.post('/toggle', async (req, res) => {
  try {
    const { type, refId, refName, sessionId } = req.body;
    if (!type || !refId || !sessionId) return res.status(400).json({ success: false });

    const existing = await Favourite.findOne({ type, refId, sessionId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, saved: false });
    }
    await Favourite.create({ type, refId, refName: refName || refId, sessionId });
    res.json({ success: true, saved: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get session's saved items
router.get('/session/:sessionId', async (req, res) => {
  try {
    const items = await Favourite.find({ sessionId: req.params.sessionId });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin — stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [topCafes, topRoasters, totalSaves, savesOverTime] = await Promise.all([
      Favourite.aggregate([
        { $match: { type: 'cafe' } },
        { $group: { _id: '$refId', name: { $first: '$refName' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Favourite.aggregate([
        { $match: { type: 'roaster' } },
        { $group: { _id: '$refId', name: { $first: '$refName' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Favourite.countDocuments(),
      Favourite.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 60 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalSaves,
        topCafes: topCafes.map((c) => ({ name: c.name, value: c.count })),
        topRoasters: topRoasters.map((r) => ({ name: r.name, value: r.count })),
        savesOverTime: savesOverTime.map((d) => ({ name: d._id, value: d.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
