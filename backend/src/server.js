import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Import routes
import cafeRoutes from "./routes/cafes.js";
import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/cafeSubmissions.js";
import tastingRoutes from "./routes/UserTastings.js";

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
app.use("/api/submissions", submissionRoutes);
app.use("/api/tastings", tastingRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
