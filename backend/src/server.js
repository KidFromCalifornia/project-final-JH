import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Import routes
import cafeRoutes from "./routes/cafes.js";
import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/cafeSubmissions.js";
import tastingRoutes from "./routes/UserTastings.js";
import { seedCafes } from "./utils/seedCafes.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "welcome to the Stockholm Coffee Club API! ☕",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/cafes", cafeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cafeSubmissions", submissionRoutes);
app.use("/api/tastings", tastingRoutes);

app.get("/api/tastings/public", async (req, res) => {
  try {
    const { UserTasting } = await import("./models/UserTasting.js");

    const tastings = await UserTasting.find({ isPublic: true })
      .populate("userId", "username")
      .populate("cafeId", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: tastings,
      count: tastings.length,
    });
  } catch (error) {
    console.error("Public tastings error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/seed", async (req, res) => {
  try {
    const result = await seedCafes();
    res.json({
      message: "Stockholm cafes seeded successfully! ☕",
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`☕ Stockholm Coffee Club API ready!`);
});
