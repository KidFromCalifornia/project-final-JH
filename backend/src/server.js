import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Import your models
import { User } from "./models/User.js";
import { Cafe } from "./models/Cafe.js";
import { CoffeeExperience } from "./models/CoffeeTasting.js";
import { CafeSubmission } from "./models/CafeSubmission.js";

// Import routes
import cafeRoutes from "./routes/cafes.js";
import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/cafeSubmissions.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Stockholm Coffee Club API is running! ☕",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// API routes - replace the placeholder with real routes
app.use("/api/cafes", cafeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
