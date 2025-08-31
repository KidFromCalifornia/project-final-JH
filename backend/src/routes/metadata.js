import express from 'express';
import CoffeeTasting from '../models/TastingsModel.js';
import { Cafe } from '../models/cafeModel.js';

const router = express.Router();

router.get('/form-options', async (req, res) => {
  try {
    const paths = CoffeeTasting.schema.paths;
    const enums = {};

    // Extract enums from all fields
    for (const key in paths) {
      if (paths[key].enumValues && paths[key].enumValues.length > 0) {
        enums[key] = paths[key].enumValues;
      }
      if (
        paths[key].instance === 'Array' &&
        paths[key].caster &&
        paths[key].caster.enumValues &&
        paths[key].caster.enumValues.length > 0
      ) {
        enums[key] = paths[key].caster.enumValues;
      }
    }

    // Fetch cafes with full location info
    const cafes = await Cafe.find(
      {},
      '_id name locations.address locations.neighborhood locations.coordinates'
    );

    res.json({
      enums,
      cafes,
    });
  } catch (error) {
    console.error('Metadata route error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
