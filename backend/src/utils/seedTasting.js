import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { CoffeeTasting } from "../models/CoffeeTasting.js";
import { User } from "../models/User.js";
import { Cafe } from "../models/Cafe.js";

dotenv.config();

const seedTastingNotes = async () => {
  try {
    await connectDB();

    // Check if real user data exists (non-seed data)
    const realUserData = await CoffeeTasting.find({
      $or: [
        { isSeeded: { $exists: false } }, // Old data without isSeeded field
        { isSeeded: false }, // Explicitly marked as real data
      ],
    });

    if (realUserData.length > 0) {
      console.log(`🛡️  Found ${realUserData.length} real user tasting notes`);
      console.log("⏭️  Skipping seed - preserving real user data");
      process.exit(0);
    }

    // Clear only seed data
    const deletedSeeds = await CoffeeTasting.deleteMany({ isSeeded: true });
    console.log(
      `🗑️  Cleared ${deletedSeeds.deletedCount} existing seed tasting notes`
    );

    // Get existing users and cafes
    const users = await User.find({});
    const cafes = await Cafe.find({});

    if (users.length === 0 || cafes.length === 0) {
      console.log("❌ Need users and cafes first. Run user and cafe seeds.");
      process.exit(1);
    }

    const tastingNotesData = [
      {
        userId: users[0]._id,
        cafeId: cafes[0]._id,
        coffeeOrigin: "Ethiopia",
        coffeeOriginRegion: "Yirgacheffe",
        coffeeName: "Kochere Washing Station",
        roastLevel: "light",
        drinkType: "pour over",
        rating: 5,
        tastingNotes: ["fruity", "floral", "sweet"],
        acidity: "high",
        mouthFeel: "light",
        notes:
          "Absolutely incredible! Bright citrus notes with a floral finish.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId: cafes[1]._id,
        coffeeOrigin: "Colombia",
        coffeeOriginRegion: "Huila",
        coffeeName: "Finca El Diviso",
        roastLevel: "medium",
        drinkType: "espresso",
        rating: 4,
        tastingNotes: ["nutty", "cocoa", "sweet"],
        acidity: "medium",
        mouthFeel: "medium",
        notes: "Rich espresso with chocolate undertones. Great crema.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId: cafes[2]._id,
        coffeeOrigin: "Guatemala",
        coffeeOriginRegion: "Antigua",
        coffeeName: "Finca San Sebastian",
        roastLevel: "dark",
        drinkType: "filtered coffee",
        rating: 3,
        tastingNotes: ["roasted", "spices"],
        acidity: "light",
        mouthFeel: "full",
        notes:
          "Personal notes - trying different roast levels. Too dark for my taste.",
        isPublic: false,
        isSeeded: true,
      },
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        cafeId: cafes[0]._id,
        coffeeOrigin: "Kenya",
        coffeeOriginRegion: "Kiambu",
        coffeeName: "Tatu Washing Station",
        roastLevel: "medium",
        drinkType: "pour over",
        rating: 4,
        tastingNotes: ["fruity", "sour"],
        acidity: "high",
        mouthFeel: "medium",
        notes: "Love the bright acidity! Reminds me of blackcurrant.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        cafeId: cafes[1]._id,
        coffeeOrigin: "Brazil",
        coffeeOriginRegion: "Santos",
        coffeeName: "Fazenda Santa Monica",
        roastLevel: "medium",
        drinkType: "espresso",
        rating: 4,
        tastingNotes: ["nutty", "cocoa"],
        acidity: "medium",
        mouthFeel: "full",
        notes: "Smooth and balanced. Perfect for morning espresso.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        cafeId: cafes[2]._id,
        coffeeOrigin: "Costa Rica",
        coffeeOriginRegion: "Tarrazú",
        coffeeName: "Finca La Minita",
        roastLevel: "light",
        drinkType: "pour over",
        rating: 5,
        tastingNotes: ["fruity", "floral", "sweet"],
        acidity: "high",
        mouthFeel: "light",
        notes: "My secret favorite spot! Amazing beans and perfect brewing.",
        isPublic: false,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId: cafes[0]._id,
        coffeeOrigin: "Panama",
        coffeeOriginRegion: "Boquete",
        coffeeName: "Hacienda La Esmeralda",
        roastLevel: "light",
        drinkType: "pour over",
        rating: 5,
        tastingNotes: ["floral", "fruity", "sweet"],
        acidity: "high",
        mouthFeel: "light",
        notes: "Premium coffee experience! Delicate and complex flavors.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        cafeId: cafes[1]._id,
        coffeeOrigin: "Jamaica",
        coffeeOriginRegion: "Blue Mountain",
        coffeeName: "Clifton Mount Estate",
        roastLevel: "medium",
        drinkType: "filtered coffee",
        rating: 4,
        tastingNotes: ["sweet", "nutty"],
        acidity: "medium",
        mouthFeel: "medium",
        notes: "Expensive but worth it for special occasions.",
        isPublic: true,
        isSeeded: true,
      },
    ];

    // Create tasting notes
    const createdTastingNotes = await CoffeeTasting.insertMany(
      tastingNotesData
    );

    console.log(`✅ Seeded ${createdTastingNotes.length} tasting notes`);
    console.log(
      `📊 ${
        createdTastingNotes.filter((note) => note.isPublic).length
      } public notes`
    );
    console.log(
      `🔒 ${
        createdTastingNotes.filter((note) => !note.isPublic).length
      } private notes`
    );
    console.log("🌱 All notes marked as seed data");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding tasting notes:", error);
    process.exit(1);
  }
};

seedTastingNotes();
