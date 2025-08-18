import mongoose from "mongoose";
import dotenv from "dotenv";
import { Cafe } from "../models/cafeModel.js";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { setTimeout as wait } from "timers/promises";

const CACHE_PATH = path.resolve(".geocode-cache.json");
const USER_AGENT = "StockholmCoffeeClub/1.0 (hello.jonnyhicks@gmail.com)";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const DEFAULT_DELAY_MS = 1100;

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}
async function saveCache(cache) {
  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch (e) {
    console.warn("Could not write geocode cache:", e.message);
  }
}
const jitter = (n) => n + Math.floor(Math.random() * n);

async function fetchNominatim(address, attempts = 5) {
  const params = new URLSearchParams({
    q: address,
    format: "jsonv2",
    addressdetails: "0",
    limit: "1",
    countrycodes: "se",
    "accept-language": "sv,en",
  });
  const url = `${NOMINATIM_BASE}?${params.toString()}`;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
      });
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        const backoff = jitter(700 * Math.pow(2, i));
        await wait(backoff);
        continue;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const body = await res.text();
        if (body.trim().startsWith("<") && i < attempts - 1) {
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
  throw new Error(`Nominatim failed for ${address}`);
}

async function geocodeAddressCached(address, opts = {}) {
  const { delayMs = DEFAULT_DELAY_MS, cacheObj = null } = opts;
  const cache = cacheObj || (await loadCache());
  if (cache[address]) return cache[address];
  await wait(delayMs);
  try {
    const json = await fetchNominatim(address);
    if (!json || !Array.isArray(json) || json.length === 0) {
      cache[address] = { success: false, provider: "nominatim", address };
      await saveCache(cache);
      return cache[address];
    }
    const top = json[0];
    const lat = parseFloat(top.lat);
    const lon = parseFloat(top.lon);
    const item = {
      success: true,
      provider: "nominatim",
      address,
      lat,
      lon,
      display_name: top.display_name || null,
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
    name: "Drop Coffee",
    website: "https://dropcoffee.com",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Wollmar Yxkullsgatan 10, 118 50 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's pioneering third wave coffee roastery. Acclaimed for their exceptional single-origin beans and precise brewing methods that started the specialty coffee movement in Sweden.",
    category: "roaster",
    features: [
      "pour_over",
      "takeaway",
      "wheelchair_accessible",
      "vegan_options",
      "pastries",
      "lunch",
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Johan & Nyström",
    website: "https://johanochnystrom.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Swedenborgsgatan 7, 118 48 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's original specialty roastery/ cafe serving consistently excellent coffee. Known for sustainable sourcing and being a cornerstone of Swedish coffee culture since 2004.",
    category: "roaster",
    features: [
      "pour_over",
      "takeaway",
      "breakfast",
      "wheelchair_accessible",
      "vegan_options",
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Pascal",
    website: "https://cafepascal.se/",
    hasMultipleLocations: true,
    locations: [
      {
        address: "Norrtullsgatan 4, 113 29 Stockholm",
        neighborhood: "Vasastan",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: "Original Vasastan location",
      },
      {
        address: "Skånegatan 76, 116 37 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: "Skånegatan (Södermalm)",
      },
      {
        address: "Sturegatan 8, 114 35 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: "Sturegatan (Östermalm)",
      },
    ],
    description:
      "Cozy neighborhood favorite known for excellent espresso and warm, welcoming atmosphere. A true local gem that perfectly embodies Stockholm's coffee culture across multiple locations.",
    category: "specialty",
    features: ["breakfast", "pastries", "takeaway", "wheelchair_accessible"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Slow Hands",
    website: "https://www.instagram.com/slowhandsbar/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Sedelvägen 35, 129 32 Stockholm",
        neighborhood: "Hägersten",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Thirdwave coffee bar focusing on careful brewing techniques and creating the perfect cup through patience and precision.",
    category: "thirdwave",
    features: [
      "pour_over",
      "takeaway",
      "vegan_options",
      "wheelchair_accessible",
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Volca Coffee Roasters",
    website: "https://volcacoffee.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Hantverkargatan 8, 112 21 Stockholm",
        neighborhood: "Kungsholmen",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "A Cafe & micro roastery on Kungsholmen, known for their focus on small batch Latin American coffee, culture and food.",
    category: "roaster",
    features: ["pour_over", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Lykke Kaffegård - Nytorget",
    website: "https://www.lykkenytorget.se/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Nytorget 4, 116 40 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Located at Nytorget, this cafe can turn into an all day affair - breakfast in the morning and drinks in the evening. Known for their cozy atmosphere and special live events.",
    category: "roaster",
    features: ["breakfast", "lunch", "takeaway", "pastries"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Café Dåndimpen's Smörgåsshop",
    website: "https://www.instagram.com/dandimpens/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Fiskshallsvägen 8, 120 44 Stockholm",
        neighborhood: "Enskede-Årsta-Vantör",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique bakehouse and sandwich shop combining excellent coffee with Swedish smörgås culture. A bakehouse first to Stockholm's independent restaurants with a front counter serving delicious sandwiches and fresh bagels.",
    category: "specialty",
    features: ["takeaway", "breakfast", "lunch"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Balue",
    website: "https://www.instagram.com/baluestockholm/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Nackagatan 3, 116 49 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Approaching coffee with a minimalist philosophy, Balue focuses on simplicity and quality. A serene spot for coffee lovers who appreciate the art of brewing.",
    category: "thirdwave",
    features: ["pour_over", "takeaway", "vegan_options", "pastries"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Stockholm Roast",
    website: "https://stockholmroast.com",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Hallvägen 9, Slakthusområdet, 121 62 Johanneshov",
        neighborhood: "Enskede-Årsta-Vantör",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "The OG roastery of Stockholm restaurant scene, fuelling restaurants with roasted coffee since 2011. They have been a staple of the restaurant scene in Stockholm for over a decade.",
    category: "roaster",
    features: ["pour_over", "takeaway", "lunch"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Kaffemissionären",
    website: "https://kaffemissionaren.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Götgatan 46, 116 21 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "In their house, coffee is gospel. Curating a selection of coffee beans from around the world, they focus on the story behind each cup. A stepping stone for those starting their coffee journey.",
    category: "roaster",
    features: ["takeaway", "pour_over"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Standout Coffee",
    website: "https://standoutcoffee.com",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Frihamnsgatan 24, 115 56 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Sourcing the most exceptional coffees from producers who share our vision for quality and sustainability. Through meticulous roasting, their approach combines skill, science, and storytelling to create coffees that stand out.",
    category: "roaster",
    features: ["no_coffee_bar", "roaster_only"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Café Nowhere",
    website: "https://www.instagram.com/cafe_nowhere.se/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Bastuhagsvägen 41, 113 25 Stockholm",
        neighborhood: "Enskede-Årsta-Vantör",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Deep in the suburbs, this cafe is a local favorite known for its cozy atmosphere with specialty coffee for those trying to escape the city.",
    category: "specialty",
    features: [
      "takeaway",
      "limited_sitting",
      "vegan_options",
      "pastries",
      "breakfast",
      "lunch",
    ],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Ölkemi Bryggeri",
    website: "https://www.instagram.com/olkemi/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Rutger Fuchsgatan 5, 116 67 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "A taproom and brewery in Södermalm, Ölkemi offers a unique experience with their own craft beers and a selection of specialty coffee. A perfect spot for those who appreciate both brews.",
    category: "thirdwave",
    features: ["outdoor_seating", "takeaway", "lunch"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Gäst",
    website: "https://www.gastcafe.se/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Rådmansgatan 57, 113 57 Stockholm",
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Welcoming guests with exceptional coffee and warm hospitality. A neighborhood favorite that treats every visitor like an honored guest.",
    category: "specialty",
    features: ["takeaway", "breakfast", "lunch"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "A La Lo Café",
    website: "https://www.instagram.com/alalocafe/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Bondegatan 64, 116 33 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique café concept combining coffee culture with creative community space. A hub for Stockholm's artistic and creative minds.",
    category: "specialty",
    features: ["takeaway", "vegan_options", "pastries", "breakfast", "lunch"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Kaffekompagniet",
    website: "https://kaffecompagniet.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Torsgatan 47, 113 37 Stockholm",
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "The Coffee Company bringing serious coffee expertise to central Stockholm. Known for their dedication to the craft of coffee making.",
    category: "specialty",
    features: ["pour_over", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Stora Bageriet",
    website: "https://storabageriet.com",
    hasMultipleLocations: true,
    locations: [
      {
        address: "Sibyllegatan 2, 114 51 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: "Flagship store",
      },
      {
        address: "Upplandsgatan 18, 113 28 Stockholm",
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: "Vasastan location",
      },
    ],
    description:
      "Artisanal bakery serving exceptional bread, pastries, and specialty coffee. Perfect for Swedish fika tradition across multiple Stockholm locations.",
    category: "specialty",
    features: ["breakfast", "pastries", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Café Blom (ArkDes)",
    website: "https://cafeblom.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Exercisplan 4, 111 49 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Located within the Swedish Centre for Architecture and Design, this café combines excellent coffee with stunning design in a unique museum setting.",
    category: "specialty",
    features: ["takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Krumel Cookies",
    website: "https://krumelcookies.com/",
    hasMultipleLocations: true,
    locations: [
      {
        address: "Valhallavägen 53, 114 25 Stockholm",
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: true,
        locationNote: "Östermalm shop",
      },
      {
        address: "Renstiernas Gata 20, 116 31 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
        isMainLocation: false,
        locationNote: "Södermalm shop",
      },
    ],
    description:
      "Artisanal cookie shop and café serving freshly baked cookies alongside specialty coffee. Known for their creative cookie flavors and cozy atmosphere.",
    category: "specialty",
    features: ["pastries", "takeaway", "limited_sitting"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Kissed by Liz",
    website: "https://kissedbyliz.com",
    hasMultipleLocations: false,
    // No public retail address found — roastery/brand only, so no placeholder coords.
    locations: [],
    isRoasteryOnly: true,
    description:
      "A specialty coffee roaster focusing on exclusive Colombian nano-lots, offering a unique coffee experience.",
    category: "roaster",
    features: ["no_coffee_bar", "roaster_only"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Nordic Brew Lab",
    website: "https://nordicbrewlab.com",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Linnégatan 75, 114 60 Stockholm",
        neighborhood: "Östermalm",
        coordinates: { type: "Point", coordinates: [0, 0] },
        isMainLocation: true,
      },
    ],
    description:
      "A specialty coffee shop offering tasting experiences and high-quality coffee equipment.",
    category: "thirdwave",
    features: ["no_coffee_bar", "limited_sitting"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Cykelcafé Le Mond",
    website: "https://cykelcafe.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Folkungagatan 67, 116 22 Stockholm",
        neighborhood: "Södermalm",
        coordinates: { type: "Point", coordinates: [0, 0] },
        isMainLocation: true,
      },
    ],
    description:
      "A bicycle-themed café offering international brunch, organic ingredients, and a cozy atmosphere inspired by cycling culture.",
    category: "thirdwave",
    features: [
      "outdoor_seating",
      "breakfast",
      "lunch",
      "takeaway",
      "vegan_options",
      "iced_drinks",
      "pastries",
      "pour_over",
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
      typeof loc.coordinates === "object" &&
      Array.isArray(loc.coordinates.coordinates)
        ? loc.coordinates
        : {
            type: "Point",
            coordinates: [0, 0], // Default/fallback for "*"
          },
  })),
}));

// Only keep cafes with at least one valid location/address
const validCafes = cleanedCafes.filter(
  (cafe) =>
    Array.isArray(cafe.locations) &&
    cafe.locations.length > 0 &&
    cafe.locations.every(
      (loc) => loc.address && typeof loc.address === "string"
    )
);
async function geocodeCafesSequential(cafes) {
  const cache = await loadCache();
  for (const cafe of cafes) {
    for (const loc of cafe.locations || []) {
      const addr = loc.address && loc.address.trim();
      if (!addr) continue;
      if (loc.coordinates?.coordinates) continue; // skip if already present
      try {
        const res = await geocodeAddressCached(addr, {
          delayMs: DEFAULT_DELAY_MS,
          cacheObj: cache,
        });
        if (res && res.success) {
          loc.coordinates = {
            type: "Point",
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
const seedCafes = async () => {
  await Cafe.deleteMany({});
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`🚀 Connected to MongoDB`);
    }

    // Find existing cafes by name
    const existingCafeNames = new Set(
      (await Cafe.find({}, "name")).map((cafe) => cafe.name)
    );

    // Only keep cafes not already in the database
    const newCafes = validCafes.filter(
      (cafe) => !existingCafeNames.has(cafe.name)
    );

    if (newCafes.length === 0) {
      console.log("No new cafes to seed. All cafes already exist.");
      return;
    }
    const cafesWithGeocodedLocations = await geocodeCafesSequential(validCafes);

    const insertedCafes = await Cafe.insertMany(cafesWithGeocodedLocations);

    console.log(
      `🌱 Successfully seeded ${
        insertedCafes.length
      } new Stockholm Coffee Club cafes!\n${insertedCafes
        .map((cafe) => cafe.name)
        .join(", ")}`
    );
  } catch (error) {
    console.error("Error seeding cafes:", error);
  }
};

console.log("Total cafes in array:", cleanedCafes.length);
console.log("Cafes to be seeded:", validCafes.length);
console.log(
  "Skipped cafes:",
  cleanedCafes
    .filter((cafe) => !validCafes.includes(cafe))
    .map((cafe) => cafe.name)
);

seedCafes();
export { seedCafes };
