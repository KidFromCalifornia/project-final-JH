import express from "express";
import { Cafe } from "../models/cafeModel.js";
import CoffeeTasting from "../models/TastingsModel.js";

const router = express.Router();

router.get("/form-options", async (req, res) => {
  const enums = {}; // <-- Declare enums here!
  const paths = CoffeeTasting.schema.paths;

  for (const key in paths) {
    if (paths[key].enumValues && paths[key].enumValues.length > 0) {
      enums[key] = paths[key].enumValues;
    }
  }

  // Add this for tastingNotes array enum
  if (paths["tastingNotes.0"]?.enumValues?.length) {
    enums.tastingNotes = paths["tastingNotes.0"].enumValues;
  }

  const cafes = await Cafe.find({}, "_id name neighborhood");

  res.json({
    enums,
    cafes,
  });
});

export default router;
