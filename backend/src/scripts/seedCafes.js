import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Cafe } from '../models/cafeModel.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { setTimeout as wait } from 'timers/promises';
dotenv.config();

const CACHE_PATH = path.resolve('.geocode-cache.json');
const DEFAULT_DELAY_MS = 1000;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const OPENCAGE_BASE = 'https://api.opencagedata.com/geocode/v1/json';

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}
async function saveCache(cache) {
  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write geocode cache:', e.message);
  }
}
const jitter = (n) => n + Math.floor(Math.random() * n);

async function fetchOpenCage(address, attempts = 5) {
  if (!OPENCAGE_API_KEY) throw new Error('Missing OPENCAGE_API_KEY in .env');
  const params = new URLSearchParams({
    q: address,
    key: OPENCAGE_API_KEY,
    countrycode: 'se',
    language: 'sv,en',
    limit: '1',
    no_annotations: '1',
  });
  const url = `${OPENCAGE_BASE}?${params.toString()}`;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        const backoff = jitter(700 * Math.pow(2, i));
        await wait(backoff);
        continue;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const body = await res.text();
        if (body.trim().startsWith('<') && i < attempts - 1) {
          const backoff = jitter(1000 * Math.pow(2, i));
          await wait(backoff);
          continue;
        }
        try {
          return JSON.parse(body);
        } catch (err) {
          throw new Error(
            `Unexpected response for "${address}": status=${res.status}, content-type=${contentType}`
          );
        }
      }
      const json = await res.json();
      return json;
    } catch (err) {
      if (i < attempts - 1) {
        const backoff = jitter(800 * Math.pow(2, i));
        await wait(backoff);
        continue;
      }
      throw err;
    }
  }
  throw new Error(`OpenCage failed for ${address}`);
}

async function geocodeAddressCached(address, opts = {}) {
  const { delayMs = DEFAULT_DELAY_MS, cacheObj = null } = opts;
  const cache = cacheObj || (await loadCache());
  if (cache[address]) return cache[address];
  await wait(delayMs);
  try {
    const json = await fetchOpenCage(address);
    if (!json || !json.results || json.results.length === 0) {
      cache[address] = { success: false, provider: 'opencage', address };
      await saveCache(cache);
      return cache[address];
    }
    const top = json.results[0];
    if (
      !top.geometry ||
      typeof top.geometry.lat !== 'number' ||
      typeof top.geometry.lng !== 'number'
    ) {
      cache[address] = {
        success: false,
        provider: 'opencage',
        address,
        error: 'Missing geometry in result',
      };
      await saveCache(cache);
      return cache[address];
    }
    const lat = top.geometry.lat;
    const lon = top.geometry.lng;
    const item = {
      success: true,
      provider: 'opencage',
      address,
      lat,
      lon,
      geometry: top.geometry,
      display_name: top.formatted || null,
    };
    cache[address] = item;
    await saveCache(cache);
    return item;
  } catch (err) {
    const obj = { success: false, error: String(err), address };
    cache[address] = obj;
    await saveCache(cache);
    throw err;
  }
}
dotenv.config();

const stockholmCafes = [
  {
    name: 'Drop Coffee',
    website: 'https://dropcoffee.com',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Wollmar Yxkullsgatan 10, 118 50 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's pioneering third wave coffee roastery. Acclaimed for their exceptional single-origin beans and precise brewing methods that started the specialty coffee movement in Sweden.",
    category: 'roaster',
    features: [
      'pour_over',
      'takeaway',
      'wheelchair_accessible',
      'vegan_options',
      'pastries',
      'lunch',
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Johan & Nyström',
    website: 'https://johanochnystrom.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Swedenborgsgatan 7, 118 48 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's original specialty roastery/ cafe serving consistently excellent coffee. Known for sustainable sourcing and being a cornerstone of Swedish coffee culture since 2004.",
    category: 'roaster',
    features: ['pour_over', 'takeaway', 'breakfast', 'wheelchair_accessible', 'vegan_options'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Pascal',
    website: 'https://cafepascal.se/',
    hasMultipleLocations: true,
    locations: [
      {
        address: 'Norrtullsgatan 4, 113 29 Stockholm',
        neighborhood: 'Vasastan',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: 'Original Vasastan location',
      },
      {
        address: 'Skånegatan 76, 116 37 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: 'Skånegatan (Södermalm)',
      },
      {
        address: 'Sturegatan 8, 114 35 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: 'Sturegatan (Östermalm)',
      },
    ],
    description:
      "Cozy neighborhood favorite known for excellent espresso and warm, welcoming atmosphere. A true local gem that perfectly embodies Stockholm's coffee culture across multiple locations.",
    category: 'specialty',
    features: ['breakfast', 'pastries', 'takeaway', 'wheelchair_accessible'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Slow Hands',
    website: 'https://www.instagram.com/slowhandsbar/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Sedelvägen 35, 129 32 Stockholm',
        neighborhood: 'Hägersten',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Thirdwave coffee bar focusing on careful brewing techniques and creating the perfect cup through patience and precision.',
    category: 'thirdwave',
    features: ['pour_over', 'takeaway', 'vegan_options', 'wheelchair_accessible'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Volca Coffee Roasters',
    website: 'https://volcacoffee.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Hantverkargatan 8, 112 21 Stockholm',
        neighborhood: 'Kungsholmen',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'A Cafe & micro roastery on Kungsholmen, known for their focus on small batch Latin American coffee, culture and food.',
    category: 'roaster',
    features: ['pour_over', 'takeaway'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Lykke Kaffegård - Nytorget',
    website: 'https://www.lykkenytorget.se/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Nytorget 4, 116 40 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Located at Nytorget, this cafe can turn into an all day affair - breakfast in the morning and drinks in the evening. Known for their cozy atmosphere and special live events.',
    category: 'roaster',
    features: ['breakfast', 'lunch', 'takeaway', 'pastries'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Café Dåndimpen's Smörgåsshop",
    website: 'https://www.instagram.com/dandimpens/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Fiskshallsvägen 8, 120 44 Stockholm',
        neighborhood: 'Enskede-Årsta-Vantör',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique bakehouse and sandwich shop combining excellent coffee with Swedish smörgås culture. A bakehouse first to Stockholm's independent restaurants with a front counter serving delicious sandwiches and fresh bagels.",
    category: 'specialty',
    features: ['takeaway', 'breakfast', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Balue',
    website: 'https://www.instagram.com/baluestockholm/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Nackagatan 3, 116 49 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Approaching coffee with a minimalist philosophy, Balue focuses on simplicity and quality. A serene spot for coffee lovers who appreciate the art of brewing.',
    category: 'thirdwave',
    features: ['pour_over', 'takeaway', 'vegan_options', 'pastries'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Stockholm Roast',
    website: 'https://stockholmroast.com',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Hallvägen 9, Slakthusområdet, 121 62 Johanneshov',
        neighborhood: 'Enskede-Årsta-Vantör',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'The OG roastery of Stockholm restaurant scene, fuelling restaurants with roasted coffee since 2011. They have been a staple of the restaurant scene in Stockholm for over a decade.',
    category: 'roaster',
    features: ['pour_over', 'takeaway', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Kaffemissionären',
    website: 'https://kaffemissionaren.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Götgatan 46, 116 21 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'In their house, coffee is gospel. Curating a selection of coffee beans from around the world, they focus on the story behind each cup. A stepping stone for those starting their coffee journey.',
    category: 'roaster',
    features: ['takeaway', 'pour_over'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Standout Coffee',
    website: 'https://standoutcoffee.com',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Frihamnsgatan 24, 115 56 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Sourcing the most exceptional coffees from producers who share our vision for quality and sustainability. Through meticulous roasting, their approach combines skill, science, and storytelling to create coffees that stand out.',
    category: 'roaster',
    features: ['no_coffee_bar', 'roaster_only'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Café Nowhere',
    website: 'https://www.instagram.com/cafe_nowhere.se/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Bastuhagsvägen 41, 113 25 Stockholm',
        neighborhood: 'Enskede-Årsta-Vantör',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Deep in the suburbs, this cafe is a local favorite known for its cozy atmosphere with specialty coffee for those trying to escape the city.',
    category: 'specialty',
    features: ['takeaway', 'limited_sitting', 'vegan_options', 'pastries', 'breakfast', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Ölkemi Bryggeri',
    website: 'https://www.instagram.com/olkemi/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Rutger Fuchsgatan 5, 116 67 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'A taproom and brewery in Södermalm, Ölkemi offers a unique experience with their own craft beers and a selection of specialty coffee. A perfect spot for those who appreciate both brews.',
    category: 'thirdwave',
    features: ['outdoor_seating', 'takeaway', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Gäst',
    website: 'https://www.gastcafe.se/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Rådmansgatan 57, 113 57 Stockholm',
        neighborhood: 'Norrmalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Welcoming guests with exceptional coffee and warm hospitality. A neighborhood favorite that treats every visitor like an honored guest.',
    category: 'specialty',
    features: ['takeaway', 'breakfast', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'A La Lo Café',
    website: 'https://www.instagram.com/alalocafe/',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Bondegatan 64, 116 33 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique café concept combining coffee culture with creative community space. A hub for Stockholm's artistic and creative minds.",
    category: 'specialty',
    features: ['takeaway', 'vegan_options', 'pastries', 'breakfast', 'lunch'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Kaffekompagniet',
    website: 'https://kaffecompagniet.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Torsgatan 47, 113 37 Stockholm',
        neighborhood: 'Norrmalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'The Coffee Company bringing serious coffee expertise to central Stockholm. Known for their dedication to the craft of coffee making.',
    category: 'specialty',
    features: ['pour_over', 'takeaway'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Stora Bageriet',
    website: 'https://storabageriet.com',
    hasMultipleLocations: true,
    locations: [
      {
        address: 'Sibyllegatan 2, 114 51 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: 'Flagship store',
      },
      {
        address: 'Upplandsgatan 18, 113 28 Stockholm',
        neighborhood: 'Norrmalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: 'Vasastan location',
      },
    ],
    description:
      'Artisanal bakery serving exceptional bread, pastries, and specialty coffee. Perfect for Swedish fika tradition across multiple Stockholm locations.',
    category: 'specialty',
    features: ['breakfast', 'pastries', 'takeaway'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Café Blom (ArkDes)',
    website: 'https://cafeblom.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Exercisplan 4, 111 49 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      'Located next to the Swedish Centre for Architecture and Design, this café combines excellent coffee with stunning design in a unique museum setting.',
    category: 'specialty',
    features: ['takeaway'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Krumel Cookies',
    website: 'https://krumelcookies.com/',
    hasMultipleLocations: true,
    locations: [
      {
        address: 'Valhallavägen 53, 114 25 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: 'Östermalm shop',
      },
      {
        address: 'Renstiernas Gata 20, 116 31 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: 'Södermalm shop',
      },
    ],
    description:
      'Artisanal cookie shop and café serving freshly baked cookies alongside specialty coffee. Known for their creative cookie flavors and cozy atmosphere.',
    category: 'specialty',
    features: ['pastries', 'takeaway', 'limited_sitting'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Kissed by Liz',
    website: 'https://kissedbyliz.com',
    hasMultipleLocations: false,
    // No public retail address found — roastery/brand only, so no placeholder coords.
    locations: [],
    isRoasteryOnly: true,
    description:
      'A specialty coffee roaster focusing on exclusive Colombian nano-lots, offering a unique coffee experience.',
    category: 'roaster',
    features: ['no_coffee_bar', 'roaster_only'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Nordic Brew Lab',
    website: 'https://nordicbrewlab.com',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Linnégatan 75, 114 60 Stockholm',
        neighborhood: 'Östermalm',
        coordinates: { type: 'Point', coordinates: [0, 0] },
        isMainLocation: true,
      },
    ],
    description:
      'A specialty coffee shop offering tasting experiences and high-quality coffee equipment.',
    category: 'thirdwave',
    features: ['no_coffee_bar', 'limited_sitting'],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: 'Cykelcafé Le Mond',
    website: 'https://cykelcafe.se',
    hasMultipleLocations: false,
    locations: [
      {
        address: 'Folkungagatan 67, 116 22 Stockholm',
        neighborhood: 'Södermalm',
        coordinates: { type: 'Point', coordinates: [0, 0] },
        isMainLocation: true,
      },
    ],
    description:
      'A bicycle-themed café offering international brunch, organic ingredients, and a cozy atmosphere inspired by cycling culture.',
    category: 'thirdwave',
    features: [
      'outdoor_seating',
      'breakfast',
      'lunch',
      'takeaway',
      'vegan_options',
      'iced_drinks',
      'pastries',
      'pour_over',
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
];

const cleanedCafes = stockholmCafes.map((cafe) => ({
  ...cafe,
  locations: cafe.locations.map((loc) => ({
    ...loc,
    coordinates:
      typeof loc.coordinates === 'object' && Array.isArray(loc.coordinates.coordinates)
        ? loc.coordinates
        : {
            type: 'Point',
            coordinates: [0, 0], // Default/fallback for "*"
          },
  })),
}));

// Only keep cafes with at least one valid location/address
const validCafes = cleanedCafes.filter(
  (cafe) =>
    Array.isArray(cafe.locations) &&
    cafe.locations.length > 0 &&
    cafe.locations.every((loc) => loc.address && typeof loc.address === 'string')
);
async function geocodeCafesSequential(cafes) {
  const cache = await loadCache();
  for (const cafe of cafes) {
    for (const loc of cafe.locations || []) {
      const addr = loc.address && loc.address.trim();
      if (!addr) {
        // Skip locations missing an address
        continue;
      }
      // Only geocode if coordinates are [0, 0] or missing
      const coords = loc.coordinates?.coordinates;
      if (Array.isArray(coords) && coords.length === 2 && !(coords[0] === 0 && coords[1] === 0)) {
        // Coordinates are present and not [0, 0], skip geocoding
        continue;
      }
      try {
        const res = await geocodeAddressCached(addr, {
          delayMs: DEFAULT_DELAY_MS,
          cacheObj: cache,
        });
        if (res && res.success) {
          loc.coordinates = {
            type: 'Point',
            coordinates: [res.lon, res.lat],
          };
          loc.geocodedDisplayName = res.display_name || res.address;
          console.log(`Geocoded ${addr}: [${res.lon}, ${res.lat}]`);
        } else {
          console.warn(`No geocode result for ${addr}`);
        }
      } catch (err) {
        console.error(`Geocoding error for ${addr}:`, err.message || err);
      }
      await saveCache(cache);
    }
  }
  return cafes;
}
const deepEqual = (a, b) => {
  // Simple deep equality check for objects/arrays
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

const seedCafes = async () => {
  let success = true;
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
      });
      console.log(`🚀 Connected to MongoDB`);
    }
    // Fetch all cafes from DB
    const dbCafes = await Cafe.find({}).lean();
    const dbCafeMap = new Map(dbCafes.map((cafe) => [cafe.name, cafe]));

    // Only keep cafes with at least one valid location/address
    const cafesToProcess = validCafes;
    const cafesToInsert = [];
    const cafesToUpdate = [];

    for (const cafe of cafesToProcess) {
      const dbCafe = dbCafeMap.get(cafe.name);
      if (!dbCafe) {
        cafesToInsert.push(cafe);
      } else {
        // Compare all fields except _id
        const { _id, ...dbCafeData } = dbCafe;
        if (!deepEqual(dbCafeData, cafe)) {
          cafesToUpdate.push({ _id, ...cafe });
        }
      }
    }

    if (cafesToInsert.length === 0 && cafesToUpdate.length === 0) {
      console.log('No new or changed cafes to seed. All cafes are up to date.');
      return;
    }

    // Geocode all cafes to insert/update
    const cafesWithGeocodedLocations = await geocodeCafesSequential(
      cafesToInsert.concat(cafesToUpdate)
    );

    // Insert new cafes
    if (cafesToInsert.length > 0) {
      const insertedCafes = await Cafe.insertMany(
        cafesWithGeocodedLocations.slice(0, cafesToInsert.length)
      );
      console.log(`🌱 Inserted ${insertedCafes.length} new cafes.`);
    }
    // Update changed cafes
    if (cafesToUpdate.length > 0) {
      for (let i = 0; i < cafesToUpdate.length; i++) {
        const cafe = cafesWithGeocodedLocations[cafesToInsert.length + i];
        await Cafe.findByIdAndUpdate(cafe._id, cafe, { new: true });
        console.log(`🔄 Updated cafe: ${cafe.name}`);
      }
    }
  } catch (error) {
    console.error('Error seeding cafes:', error);
    success = false;
  } finally {
    // Only disconnect and exit if run directly, not when imported
    if (import.meta.url === `file://${process.argv[1]}`) {
      await mongoose.disconnect();
      process.exit(success ? 0 : 1);
    }
  }
  
  return { success, count: validCafes.length };
};

console.log('Total cafes in array:', cleanedCafes.length);
console.log('Cafes to be seeded:', validCafes.length);
console.log(
  'Skipped cafes:',
  cleanedCafes.filter((cafe) => !validCafes.includes(cafe)).map((cafe) => cafe.name)
);

// Only run if this file is executed directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCafes();
}

export { seedCafes };
