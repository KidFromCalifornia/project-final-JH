// Usage: node src/scripts/seedUsers.js
// Seeds sample users into the database. Passwords are hashed for security.
// Exit code 0 = success, 1 = failure.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../backend/src/models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  {
    username: 'Admin',
    email: 'admin@example.com',
    password: 'Admin123', // Will be hashed below
    role: 'admin', // Admin user
  },
  {
    username: 'TestUser',
    email: 'testuser@example.com',
    password: 'User1234', // Will be hashed below
    role: 'user', // Regular user
  },
];

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
};

const seedUsers = async () => {
  let success = true;
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🚀 Connected to MongoDB (seedUsers)');
    }
    const dbUsers = await User.find({}).lean();
    const dbUserMap = new Map(dbUsers.map((u) => [u.email, u]));
    const usersToInsert = [];
    const usersToUpdate = [];
    for (const userData of users) {
      const dbUser = dbUserMap.get(userData.email);
      // Hash password for comparison and saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const userObj = { ...userData, password: hashedPassword };
      if (!dbUser) {
        usersToInsert.push(userObj);
      } else {
        const { _id, ...dbUserData } = dbUser;
        // Compare username, role, and password
        if (!deepEqual({ ...dbUserData, password: dbUser.password }, userObj)) {
          usersToUpdate.push({ _id, ...userObj });
        }
      }
    }
    if (usersToInsert.length === 0 && usersToUpdate.length === 0) {
      console.log('No new or changed users to seed. All users are up to date.');
      return;
    }
    if (usersToInsert.length > 0) {
      for (const user of usersToInsert) {
        await new User(user).save();
        console.log(`🌱 Inserted user: ${user.email}`);
      }
    }
    if (usersToUpdate.length > 0) {
      for (const user of usersToUpdate) {
        await User.findByIdAndUpdate(user._id, user, { new: true });
        console.log(`🔄 Updated user: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
    success = false;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(success ? 0 : 1);
  }
};

seedUsers();
