import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Visit } from '../models/VisitModel.js';

const router = express.Router();

const getDevice = (ua = '') => {
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
};

// Public — record a visit (fire and forget)
router.post('/', async (req, res) => {
  try {
    const { page, visitorId } = req.body;
    if (!page) return res.status(400).json({ success: false });
    const device = getDevice(req.headers['user-agent']);
    const referrer = req.headers['referer'] || '';
    await Visit.create({ page, device, referrer, visitorId: visitorId || '' });
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// Admin — get stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const baseMatch = { createdAt: { $gte: since }, page: { $not: /^\/admin/ } };

    const [total, uniqueVisitors, byPage, byDevice, byDay] = await Promise.all([
      Visit.countDocuments(baseMatch),

      Visit.aggregate([
        { $match: { ...baseMatch, visitorId: { $ne: '' } } },
        { $group: { _id: '$visitorId' } },
        { $count: 'count' },
      ]),

      Visit.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Visit.aggregate([
        { $match: { ...baseMatch, visitorId: { $ne: '' } } },
        { $group: { _id: '$device', visitors: { $addToSet: '$visitorId' } } },
        { $project: { _id: 1, count: { $size: '$visitors' } } },
      ]),

      Visit.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        total,
        uniqueVisitors: uniqueVisitors[0]?.count || 0,
        byPage: byPage.map((p) => ({ name: p._id, value: p.count })),
        byDevice: byDevice.map((d) => ({ name: d._id, value: d.count })),
        byDay: byDay.map((d) => ({ name: d._id, value: d.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
