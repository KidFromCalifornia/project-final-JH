import express from 'express';
import rateLimit from 'express-rate-limit';
import { Cafe } from '../models/cafeModel.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'StockholmCoffeeClub/1.0' } });
  const data = await res.json();
  if (data.length > 0) {
    return { type: 'Point', coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] };
  }
  return null;
};

// POST — submit a new cafe (public, isApproved: false by default)
router.post('/', submitLimiter, async (req, res) => {
  try {
    const locationsWithCoords = await Promise.all(
      (req.body.locations || []).map(async (loc) => {
        if (
          loc.coordinates &&
          Array.isArray(loc.coordinates.coordinates) &&
          loc.coordinates.coordinates.length === 2 &&
          typeof loc.coordinates.coordinates[0] === 'number' &&
          typeof loc.coordinates.coordinates[1] === 'number'
        ) {
          return loc;
        }
        if (loc.address) {
          const coords = await geocodeAddress(`${loc.address}, Stockholm, Sweden`);
          if (coords) return { ...loc, coordinates: coords };
        }
        const { coordinates, ...rest } = loc;
        return rest;
      })
    );
    const cleanedLocations = locationsWithCoords;

    let submittedBy = req.body.userId;
    if (submittedBy === 'user' || !submittedBy) submittedBy = undefined;

    const cafe = new Cafe({
      ...req.body,
      locations: cleanedLocations,
      submittedBy,
      isApproved: false,
    });
    await cafe.save();
    res.status(201).json({ success: true, data: cafe });
  } catch (error) {
    console.error('Error creating cafe:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET — all approved cafes with filtering and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      neighborhood,
      category,
      features,
      search,
      sortBy = 'name',
      order = 'asc',
    } = req.query;

    const query = { isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'locations.neighborhood': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'locations.address': { $regex: search, $options: 'i' } },
      ];
    }

    if (neighborhood) query['locations.neighborhood'] = { $regex: neighborhood, $options: 'i' };
    if (category) query.category = { $in: category.split(',') };
    if (features) query.features = { $in: features.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };

    const [cafes, total] = await Promise.all([
      Cafe.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)).lean(),
      Cafe.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: cafes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCafes: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cafes:', error);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
  }
});

// GET /pending — admin: all unapproved cafes (must be before /:id)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pending = await Cafe.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /filters/options — must be before /:id
router.get('/filters/options', async (req, res) => {
  try {
    const [neighborhoods, categories, features] = await Promise.all([
      Cafe.distinct('locations.neighborhood', { isApproved: true }),
      Cafe.distinct('category', { isApproved: true }),
      Cafe.distinct('features', { isApproved: true }),
    ]);

    res.json({
      success: true,
      data: {
        neighborhoods: neighborhoods.sort(),
        categories: categories.sort(),
        features: features.sort(),
      },
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /search/suggestions — must be before /:id
router.get('/search/suggestions', searchLimiter, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: { cafes: [], neighborhoods: [] } });
    }

    const [cafeSuggestions, neighborhoodSuggestions] = await Promise.all([
      Cafe.find(
        { isApproved: true, name: { $regex: q, $options: 'i' } },
        { name: 1, 'locations.neighborhood': 1 }
      ).limit(5),
      Cafe.distinct('locations.neighborhood', {
        isApproved: true,
        'locations.neighborhood': { $regex: q, $options: 'i' },
      }),
    ]);

    res.json({ success: true, data: { cafes: cafeSuggestions, neighborhoods: neighborhoodSuggestions } });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /nearby/:lat/:lng — must be before /:id
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { maxDistance = 5000 } = req.query;

    const cafes = await Cafe.find({
      isApproved: true,
      'locations.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(20);

    res.json({ success: true, data: cafes });
  } catch (error) {
    console.error('Error fetching nearby cafes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /:id — single cafe
router.get('/:id', validateObjectId(), async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ success: false, error: 'Cafe not found' });
    res.json({ success: true, data: cafe });
  } catch (error) {
    console.error('Error fetching cafe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /:id/approve — admin: approve a cafe
router.put('/:id/approve', validateObjectId(), authenticateToken, requireAdmin, async (req, res) => {
  try {
    const submission = await Cafe.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, error: 'Cafe not found' });

    // If this is a new location for an existing cafe, merge it in
    if (submission.parentCafeId) {
      const parent = await Cafe.findById(submission.parentCafeId);
      if (!parent) return res.status(404).json({ success: false, error: 'Parent cafe not found' });

      parent.locations.push(...submission.locations);
      parent.hasMultipleLocations = true;
      await parent.save();

      await Cafe.findByIdAndDelete(req.params.id);

      return res.json({ success: true, message: 'Location added to existing cafe', data: parent });
    }

    // Otherwise just approve as a new cafe
    submission.isApproved = true;
    await submission.save();
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /:id — admin: update a cafe
router.put('/:id', validateObjectId(), authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cafe) return res.status(404).json({ success: false, error: 'Cafe not found' });
    res.json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /:id — admin: delete a cafe
router.delete('/:id', validateObjectId(), authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!cafe) return res.status(404).json({ success: false, error: 'Cafe not found' });
    res.json({ success: true, message: 'Cafe deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
