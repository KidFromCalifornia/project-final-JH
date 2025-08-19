// Usage: node src/scripts/fixMissingCafeId.js
// Fixes tastings with missing cafeId by matching cafeNeighborhood to Cafe.
// Exit code 0 = success, 1 = failure.

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://hellojonnyhicks:mE5YLVeLG6X1CC1Y@cluster0.5jfbtlp.mongodb.net/stockholmscoffeeclub?retryWrites=true&w=majority&appName=Cluster0";

import { Cafe } from "../models/cafeModel.js";
import CoffeeTasting from "../models/TastingsModel.js";

async function fixTastings() {
  let success = true;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const tastings = await CoffeeTasting.find({ cafeId: null });
    console.log(`Found ${tastings.length} tastings with missing cafeId.`);

    for (const tasting of tastings) {
      if (!tasting.cafeNeighborhood) continue;
      // Try to find a cafe by matching locations.neighborhood
      const cafe = await Cafe.findOne({
        locations: {
          $elemMatch: { neighborhood: tasting.cafeNeighborhood },
        },
      });
      if (cafe) {
        tasting.cafeId = cafe._id;
        await tasting.save();
        console.log(`Updated tasting ${tasting._id} with cafeId ${cafe._id}`);
      } else {
        console.log(
          `No cafe found for tasting ${tasting._id} with neighborhood ${tasting.cafeNeighborhood}`
        );
      }
    }
  } catch (error) {
    console.error("Error fixing tastings:", error);
    success = false;
  } finally {
    await mongoose.disconnect();
    console.log("Done.");
    process.exit(success ? 0 : 1);
  }
}

fixTastings();
