import express from "express";
import { Cafe } from "../models/Cafe.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all cafes (public)
router.get("/", async (req, res) => {
  try {
    const cafes = await Cafe.find({ isApproved: true });
    res.json({
      success: true,
      count: cafes.length,
      data: cafes,
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

// GET single cafe (public)
router.get("/:id", async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      return res.status(404).json({
        success: false,
        error: "Cafe not found",
      });
    }
    res.json({
      success: true,
      data: cafe,
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

// POST new cafe (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cafe = new Cafe({
      ...req.body,
      isApproved: true, // Admin-created cafes are auto-approved
    });

    await cafe.save();

    res.status(201).json({
      success: true,
      message: "Cafe created successfully",
      data: cafe,
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

//remove cafe (admin only)

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!cafe) {
      return res.status(404).json({
        success: false,
        error: "Cafe not found",
      });
    }
    res.json({
      success: true,
      message: "Cafe deleted successfully",
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
// Update cafe (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cafe) {
      return res.status(404).json({
        success: false,
        error: "Cafe not found",
      });
    }

    res.json({
      success: true,
      message: "Cafe updated successfully",
      data: cafe,
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
