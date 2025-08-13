import express from "express";
import { Cafe } from "../models/cafeModel.js";
import { CoffeeTasting } from "../models/TastingsModel.js";

const router = express.Router();

router.get("/form-options", async (req, res) => {
  // Get enums from schema
  const enums = {};
  const paths = CoffeeTasting.schema.paths;
  for (const key in paths) {
    if (paths[key].enumValues && paths[key].enumValues.length > 0) {
      enums[key] = paths[key].enumValues;
    }
  }

  // Get cafes from DB
  const cafes = await Cafe.find({}, "_id name neighborhood");

  res.json({
    enums,
    cafes,
  });
});

export default router;
