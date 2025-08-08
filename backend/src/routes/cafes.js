import express from "express";
import { Cafe } from "../models/Cafe.js";

const router = express.Router();

// GET all cafes with filtering and search
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      neighborhood,
      category,
      features,
      search,
      sortBy = "name",
      order = "asc",
    } = req.query;

    // Build query object
    const query = { isApproved: true };

    // Text search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "locations.neighborhood": { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "locations.address": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by specific neighborhood
    if (neighborhood) {
      query["locations.neighborhood"] = { $regex: neighborhood, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = { $in: category.split(",") };
    }

    // Filter by features
    if (features) {
      query.features = { $in: features.split(",") };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Execute query with pagination
    const [cafes, total] = await Promise.all([
      Cafe.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Cafe.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: cafes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCafes: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cafes:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single cafe by ID
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
    console.error("Error fetching cafe:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET filter options for frontend
router.get("/filters/options", async (req, res) => {
  try {
    const [neighborhoods, categories, features] = await Promise.all([
      Cafe.distinct("locations.neighborhood", { isApproved: true }),
      Cafe.distinct("category", { isApproved: true }),
      Cafe.distinct("features", { isApproved: true }),
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
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET search suggestions
router.get("/search/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: {
          cafes: [],
          neighborhoods: [],
        },
      });
    }

    const [cafeSuggestions, neighborhoodSuggestions] = await Promise.all([
      Cafe.find(
        {
          isApproved: true,
          name: { $regex: q, $options: "i" },
        },
        { name: 1, "locations.neighborhood": 1 }
      ).limit(5),

      Cafe.distinct("locations.neighborhood", {
        isApproved: true,
        "locations.neighborhood": { $regex: q, $options: "i" },
      }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        cafes: cafeSuggestions,
        neighborhoods: neighborhoodSuggestions,
      },
    });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET nearby cafes (requires geolocation)
router.get("/nearby/:lat/:lng", async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { maxDistance = 5000 } = req.query; // Default 5km radius

    const cafes = await Cafe.find({
      isApproved: true,
      "locations.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(20);

    res.json({
      success: true,
      data: cafes,
    });
  } catch (error) {
    console.error("Error fetching nearby cafes:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
