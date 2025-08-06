import express from "express";
import { CafeSubmission } from "../models/CafeSubmission.js";
import { Cafe } from "../models/Cafe.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Submit new cafe (authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const submission = new CafeSubmission({
      ...req.body,
      submittedBy: req.user.userId,
      status: "pending",
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "Cafe submission received! Awaiting admin approval.",
      data: submission,
    });
  } catch (error) {
    console.error("Error in route:", error); // Add logging
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message, // Hide details in production
    });
  }
});

// Get all submissions (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const submissions = await CafeSubmission.find()
      .populate("submittedBy", "username email")
      .populate("reviewedBy", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Error in route:", error); // Add logging
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message, // Hide details in production
    });
  }
});

// Approve submission (admin only)
router.put(
  "/:id/approve",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const submission = await CafeSubmission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: "Submission not found",
        });
      }

      if (submission.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Submission has already been reviewed",
        });
      }

      // Create actual cafe from submission
      const cafe = new Cafe({
        name: submission.name,
        address: submission.address,
        neighborhood: submission.neighborhood,
        description: submission.description,
        category: submission.category,
        features: submission.features,
        images:
          submission.images.length > 0
            ? submission.images
            : [
                `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                  submission.name
                )}`,
              ],
        location: {
          type: "Point",
          coordinates: [18.0649, 59.3426], // Default Stockholm coordinates
        },
        isApproved: true,
      });

      await cafe.save();

      // Update submission status
      submission.status = "approved";
      submission.reviewedBy = req.user.userId;
      submission.reviewedAt = new Date();
      await submission.save();

      res.json({
        success: true,
        message: "Cafe submission approved and added to database",
        cafe: cafe,
        submission: submission,
      });
    } catch (error) {
      console.error("Error in route:", error); // Add logging
      res.status(500).json({
        success: false,
        error:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message, // Hide details in production
      });
    }
  }
);

export default router;
