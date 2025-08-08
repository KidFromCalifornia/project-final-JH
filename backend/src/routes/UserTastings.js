import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { CoffeeTasting } from "../models/CoffeeTasting.js";

const router = express.Router();

// Public routes - No authentication required

// Get all public tasting notes (latest 20)
router.get("/public", async (req, res) => {
  try {
    const publicTastingNotes = await CoffeeTasting.find({ isPublic: true })
      .populate(
        "cafeId",
        "name website hasMultipleLocations locations neighborhood"
      )
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: publicTastingNotes.length,
      message: `Latest ${publicTastingNotes.length} public coffee tasting notes from the community`,
      data: publicTastingNotes,
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

// Get public tasting notes for a specific cafe
router.get("/public/cafe/:cafeId", async (req, res) => {
  try {
    const { cafeId } = req.params;

    const publicTastingNotes = await CoffeeTasting.find({
      cafeId: cafeId,
      isPublic: true,
    })
      .populate("cafeId", "name website hasMultipleLocations locations")
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: publicTastingNotes.length,
      message: `Public tasting notes for this cafe`,
      data: publicTastingNotes,
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

// Protected routes - Authentication required

// Get user's own tasting notes (both public and private)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userTastingNotes = await CoffeeTasting.find({
      userId: req.user.userId,
    })
      .populate("cafeId", "name website hasMultipleLocations locations")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: userTastingNotes.length,
      message: "Your tasting notes",
      data: userTastingNotes,
    });
  } catch (error) {
    console.error("Error in route:", error);
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// Create new tasting note
router.post("/", authenticateToken, async (req, res) => {
  try {
    const tastingNoteData = {
      ...req.body,
      userId: req.user.userId,
    };

    const newTastingNote = new CoffeeTasting(tastingNoteData);
    const savedTastingNote = await newTastingNote.save();

    // Populate the response
    const populatedTastingNote = await CoffeeTasting.findById(
      savedTastingNote._id
    ).populate("cafeId", "name website hasMultipleLocations locations");

    res.status(201).json({
      success: true,
      message: `Tasting note created and set to ${
        savedTastingNote.isPublic ? "public" : "private"
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
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id).populate(
      "cafeId",
      "name neighborhood"
    );

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: "Tasting note not found",
      });
    }

    // Users can only view their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "You can only view your own tasting notes",
      });
    }

    res.json({
      success: true,
      data: tastingNote,
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

// Update tasting note (user's own only) - Can change privacy and other fields
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id);

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: "Tasting note not found",
      });
    }

    // Users can only edit their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "You can only edit your own tasting notes",
      });
    }

    const updatedTastingNote = await CoffeeTasting.findByIdAndUpdate(
      req.params.id,
      req.body, // This can include isPublic: true/false
      { new: true, runValidators: true }
    ).populate("cafeId", "name website hasMultipleLocations locations");

    res.json({
      success: true,
      message: `Tasting note updated and set to ${
        updatedTastingNote.isPublic ? "public" : "private"
      }`,
      data: updatedTastingNote,
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

// Delete tasting note (user's own only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const tastingNote = await CoffeeTasting.findById(req.params.id);

    if (!tastingNote) {
      return res.status(404).json({
        success: false,
        error: "Tasting note not found",
      });
    }

    // Users can only delete their own tasting notes
    if (tastingNote.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own tasting notes",
      });
    }

    await CoffeeTasting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Tasting note deleted successfully",
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

// Admin route - Get all tasting notes (public and private)
router.get("/admin/all", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    const allTastingNotes = await CoffeeTasting.find({})
      .populate("cafeId", "name website hasMultipleLocations locations")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: allTastingNotes.length,
      message: "All tasting notes (admin view)",
      data: allTastingNotes,
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

export default router;
