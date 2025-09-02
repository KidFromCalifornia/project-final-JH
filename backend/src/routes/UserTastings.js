import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { CoffeeTasting } from '../models/TastingsModel.js';
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

    // Filter out any tastings with missing refs
    const validTastings = publicTastingNotes.filter((tasting) => tasting.cafeId && tasting.userId);

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

// Create new tasting note
router.post('/', authenticateToken, async (req, res) => {
  try {
    const tastingNoteData = {
      ...req.body,
      userId: req.user.userId,
    };

    const newTastingNote = new CoffeeTasting(tastingNoteData);
    const savedTastingNote = await newTastingNote.save();

    // Populate the response
    const populatedTastingNote = await CoffeeTasting.findById(savedTastingNote._id).populate(
      'cafeId',
      'name website hasMultipleLocations locations'
    );

    res.status(201).json({
      success: true,
      message: `Tasting note created and set to ${
        savedTastingNote.isPublic ? 'public' : 'private'
      }`,
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

router.put('/:id', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id);

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: 'Tasting note not found',
      });
    }

    // Users can only edit their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own tasting notes',
      });
    }

    const updatedTastingNote = await CoffeeTasting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('cafeId', 'name website hasMultipleLocations locations');

    res.json({
      success: true,
      message: `Tasting note updated and set to ${
        updatedTastingNote.isPublic ? 'public' : 'private'
      }`,
      data: updatedTastingNote,
    });
  } catch (error) {
    console.error('Error in route:', error); // Add logging
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message, // Hide details in production
    });
  }
});

// Delete tasting note (user's own only)
router.delete('/:id', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id);

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: 'Tasting note not found',
      });
    }

    // Users can only delete their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own tasting notes',
      });
    }

    await CoffeeTasting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tasting note deleted successfully',
    });
  } catch (error) {
    console.error('Error in route:', error); // Add logging
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message, // Hide details in production
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
