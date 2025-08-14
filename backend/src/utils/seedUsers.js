import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const users = [
  {
    username: "Admin",
    email: "admin@example.com",
    password: "Admin123", // Hash in production!
    role: "admin", // Admin user
  },
  {
    username: "TestUser",
    email: "testuser@example.com",
    password: "User1234",
    role: "user", // Regular user
  },
];

const seedUsers = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("🚀 Connected to MongoDB (seedUsers)");
    }

    await User.deleteMany({});
    console.log("🧹 Cleared existing users");

    const insertedUsers = await User.insertMany(users);
    console.log(`🌱 Seeded ${insertedUsers.length} users`);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedUsers();
