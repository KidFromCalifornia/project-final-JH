import express from 'express';
import { Cafe, CafeSubmission } from '../models/cafeModel.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST create new cafe submission

router.post('/', authenticateToken, async (req, res) => {
  // Simple validation - check required fields
  const { name, locations, category, features } = req.body;

  if (!name || !locations || !Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Name and at least one location are required',
    });
  }

  if (!category || !features || !Array.isArray(features)) {
    return res.status(400).json({
      success: false,
      error: 'Category and features are required',
    });
  }

  try {
    const submissionData = {
      ...req.body,
      submittedBy: req.user.userId,
      isApproved: false,
    };

    const submission = new CafeSubmission(submissionData);
    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Cafe submission created successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// GET all submissions (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query
    let query = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const [submissions, total] = await Promise.all([
      CafeSubmission.find(query)
        .populate('submittedBy', 'username email')
        .populate('reviewedBy', 'username email')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      CafeSubmission.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalSubmissions: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT approve submission (admin only)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const submission = await CafeSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    // Create new cafe from submission (using new schema)
    const newCafe = new Cafe({
      name: submission.name,
      website: submission.website,
      hasMultipleLocations: submission.hasMultipleLocations,
      locations: submission.locations,
      description: submission.description,
      category: submission.category,
      features: submission.features,
      images: submission.images,
      isApproved: true,
      submittedBy: submission.submittedBy,
    });

    await newCafe.save();

    // Update submission status
    submission.isApproved = true;
    submission.reviewedBy = req.user.userId;
    submission.reviewedAt = new Date();
    await submission.save();

    res.json({
      success: true,
      message: 'Submission approved and cafe created',
      data: {
        submission,
        cafe: newCafe,
      },
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE reject submission (admin only)
router.delete('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const submission = await CafeSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    // Update submission with rejection details
    submission.isApproved = false;
    submission.rejectionReason = rejectionReason;
    submission.reviewedBy = req.user.userId;
    submission.reviewedAt = new Date();
    await submission.save();

    res.json({
      success: true,
      message: 'Submission rejected',
      data: submission,
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET user's own submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await CafeSubmission.find({
      submittedBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single submission by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const submission = await CafeSubmission.findById(req.params.id)
      .populate('submittedBy', 'username email')
      .populate('reviewedBy', 'username email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    // Check if user can access this submission
    if (submission.submittedBy._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
