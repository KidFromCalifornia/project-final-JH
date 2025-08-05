import mongoose from "mongoose";
import dotenv from "dotenv";
import { Cafe } from "../models/Cafe.js";
import connectDB from "../config/database.js";

dotenv.config();

const seedCafes = [
  {
    name: "Cafe Pascal",
    neighborhood: "Vasastan",
    description: "Cozy neighborhood cafe with excellent coffee and pastries",
    address: "Upplandsgatan 46, Stockholm", // String, not array
    location: {
      type: "Point",
      coordinates: [18.0649, 59.3426],
    },
    category: ["Thirdwave", "roaster"], // Must match your enum: ["specialty", "roaster", "Thirdwave"]
    features: [
      "outdoor_seating",
      "indoor_seating",
      "breakfast",
      "takeaway",
      "pour_over",
    ],
    images: ["https://via.placeholder.com/400x300?text=Cafe+Pascal"],
    isApproved: true,
  },
  {
    name: "Drop Coffee",
    neighborhood: "Södermalm",
    description: "Third wave coffee roaster with amazing single origins",
    address: "Wollmar Yxkullsgatan 10, Stockholm", // String, not array
    location: {
      type: "Point",
      coordinates: [18.0649, 59.3156],
    },
    category: ["roaster", "Thirdwave"],
    features: ["pour_over", "takeaway", "indoor_seating"],
    images: ["https://via.placeholder.com/400x300?text=Drop+Coffee"],
    isApproved: true,
  },
  {
    name: "Johan & Nyström",
    neighborhood: "Östermalm",
    description: "Classic Stockholm coffee roaster with multiple locations",
    address: "Sturegatan 8, Stockholm",
    location: {
      type: "Point",
      coordinates: [18.074, 59.3347],
    },
    category: ["roaster"],
    features: ["takeaway", "indoor_seating", "breakfast"],
    images: ["https://via.placeholder.com/400x300?text=Johan+Nystrom"],
    isApproved: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing cafes
    await Cafe.deleteMany({});
    console.log("🗑️  Cleared existing cafes");

    // Insert seed data
    const cafes = await Cafe.insertMany(seedCafes);
    console.log(`✅ Seeded ${cafes.length} cafes`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
