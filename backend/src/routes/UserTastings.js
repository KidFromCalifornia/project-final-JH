import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { CoffeeTasting } from '../models/TastingsModel.js';
import { User } from '../models/User.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/public', async (req, res) => {
  try {
    const publicTastingNotes = await CoffeeTasting.find({ isPublic: true })
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Use lean for better performance

    // Filter out any tastings with missing refs (cafeId is required, userId is optional)
    const validTastings = publicTastingNotes.filter((tasting) => tasting.cafeId);

    res.json({
      success: true,
      count: validTastings.length,
      message: `Latest ${validTastings.length} public coffee tasting notes from the community`,
      data: validTastings,
    });
  } catch (error) {
    console.error('Error fetching public tastings:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});
router.get('/public/search', async (req, res) => {
  const { query, brewMethod, minRating, maxRating, origin } = req.query;

  if (!query && !brewMethod && !minRating && !origin) {
    return res.status(400).json({
      success: false,
      error: 'At least one search parameter is required',
    });
  }

  try {
    const searchCriteria = { isPublic: true };
    const orConditions = [];

    // Text search
    if (query) {
      orConditions.push(
        { coffeeName: { $regex: query, $options: 'i' } },
        { tastingNotes: { $regex: query, $options: 'i' } },
        { coffeeOrigin: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } }
      );
    }

    // Filters
    if (brewMethod) searchCriteria.brewMethod = brewMethod;
    if (origin) searchCriteria.coffeeOrigin = { $regex: origin, $options: 'i' };

    if (minRating || maxRating) {
      searchCriteria.rating = {};
      if (minRating) searchCriteria.rating.$gte = parseInt(minRating);
      if (maxRating) searchCriteria.rating.$lte = parseInt(maxRating);
    }

    if (orConditions.length > 0) {
      searchCriteria.$or = orConditions;
    }

    const results = await CoffeeTasting.find(searchCriteria)
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: results.length,
      message: `Found ${results.length} public tastings`,
      filters: req.query,
      data: results,
    });
  } catch (error) {
    console.error('Public search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
    });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userTastingNotes = await CoffeeTasting.find({
      userId: req.user.userId,
    })
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username _id')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: userTastingNotes.length,
      message: 'Your tasting notes',
      data: userTastingNotes,
    });
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});

// Create new tasting note — no login required
router.post('/', async (req, res) => {
  try {
    const { signature, ...tastingData } = req.body;
    const trimmedSignature = (signature || '').trim();

    let userId;
    let username;

    if (!trimmedSignature) {
      // Find or create the shared Anonymous user
      let anonUser = await User.findOne({ username: 'Anonymous' });
      if (!anonUser) {
        anonUser = await User.create({ username: 'Anonymous' });
      }
      userId = anonUser._id;
      username = 'Anonymous';
    } else {
      // Find existing user by username (case-insensitive), or create new one
      let user = await User.findOne({ username: { $regex: `^${trimmedSignature}$`, $options: 'i' } });
      if (!user) {
        user = await User.create({ username: trimmedSignature });
      }
      userId = user._id;
      username = user.username;
    }

    const newTastingNote = new CoffeeTasting({
      ...tastingData,
      userId,
      username,
      isPublic: true,
    });
    const savedTastingNote = await newTastingNote.save();

    const populatedTastingNote = await CoffeeTasting.findById(savedTastingNote._id).populate(
      'cafeId',
      'name website hasMultipleLocations locations'
    );

    res.status(201).json({
      success: true,
      message: 'Tasting note created',
      data: populatedTastingNote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get specific tasting note (user's own only)
router.get('/:id', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id).populate(
      'cafeId',
      'name website hasMultipleLocations locations'
    );

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: 'Tasting note not found',
      });
    }

    // Users can only view their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own tasting notes',
      });
    }

    res.json({
      success: true,
      data: tastingNote,
    });
  } catch (error) {
    console.error('Error in route:', error); // Add logging
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message, // Hide details in production
    });
  }
});

// Admin-only edit
router.put('/:id', validateObjectId(), authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updatedTastingNote = await CoffeeTasting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('cafeId', 'name website hasMultipleLocations locations');

    if (!updatedTastingNote) {
      return res.status(404).json({ success: false, error: 'Tasting note not found' });
    }

    res.json({ success: true, data: updatedTastingNote });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});

// Admin-only delete
router.delete('/:id', validateObjectId(), authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await CoffeeTasting.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tasting note not found' });
    }
    res.json({ success: true, message: 'Tasting note deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});

// Admin route - Get all tasting notes (public and private)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    const allTastingNotes = await CoffeeTasting.find({})
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: allTastingNotes.length,
      message: 'All tasting notes (admin view)',
      data: allTastingNotes,
    });
  } catch (error) {
    console.error('Error in route:', error); // Add logging
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message, // Hide details in production
    });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  try {
    const results = await CoffeeTasting.find({
      $text: { $search: query },
      isPublic: true,
    })
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username')
      .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
      .limit(50);

    res.json({
      success: true,
      count: results.length,
      message: `Found ${results.length} tastings for "${query}"`,
      data: results,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
    });
  }
});

// Filter by rating, brew method, etc.
router.get('/filter', async (req, res) => {
  const { espresso, filteredCoffee, pourOver, other } = req.query;
  try {
    const filterCriteria = {};
    if (espresso) filterCriteria.brewMethod = 'espresso';
    if (filteredCoffee) filterCriteria.brewMethod = 'filtered coffee';
    if (pourOver) filterCriteria.brewMethod = 'pour over';
    if (other) filterCriteria.brewMethod = 'other';

    const filteredTastings = await CoffeeTasting.find(filterCriteria)
      .populate('cafeId', 'name website hasMultipleLocations locations')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: filteredTastings.length,
      message: 'Filtered tasting notes',
      data: filteredTastings,
    });
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});

export default router;
