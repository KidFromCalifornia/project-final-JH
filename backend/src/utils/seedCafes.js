import mongoose from "mongoose";
import dotenv from "dotenv";
import { Cafe } from "../models/Cafe.js";

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
          coordinates: [18.0649, 59.314],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's pioneering third wave coffee roastery. Acclaimed for their exceptional single-origin beans and precise brewing methods that started the specialty coffee movement in Sweden.",
    category: ["thirdwave", "roaster"],
    features: ["pour_over", "takeaway"],
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
          coordinates: [18.0702, 59.315],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Stockholm's beloved roastery serving consistently excellent coffee. Known for sustainable sourcing and being a cornerstone of Swedish coffee culture since 2004.",
    category: ["roaster", "specialty"],
    features: ["pour_over", "takeaway", "breakfast"],
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
          coordinates: [18.058, 59.342],
        },
        isMainLocation: true,
        locationNote: "Original Vasastan location",
      },
      {
        address: "Kungsgatan 44, 111 35 Stockholm",
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [18.065, 59.3325],
        },
        isMainLocation: false,
        locationNote: "Kungsgatan location",
      },
      {
        address: "Södermannagatan 21, 116 40 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.072, 59.314],
        },
        isMainLocation: false,
        locationNote: "Södermalm location",
      },
    ],
    description:
      "Cozy neighborhood favorite known for excellent espresso and warm, welcoming atmosphere. A true local gem that perfectly embodies Stockholm's coffee culture across multiple locations.",
    category: ["specialty"],
    features: ["breakfast", "pastries", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Slow Hands",
    website: "https://www.instagram.com/slowhandscoffee/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Hagastensvägen 30, 113 48 Stockholm",
        neighborhood: "Vasastan",
        coordinates: {
          type: "Point",
          coordinates: [18.03, 59.35],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Specialty coffee bar focusing on careful brewing techniques and creating the perfect cup through patience and precision.",
    category: ["thirdwave"],
    features: ["pour_over", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Volca Coffee Roaster",
    website: "https://volcacoffee.se",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Hantverkargatan 8, 112 21 Stockholm",
        neighborhood: "Kungsholmen",
        coordinates: {
          type: "Point",
          coordinates: [18.035, 59.335],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Artisanal coffee roastery on Kungsholmen, known for their volcanic approach to roasting and creating explosive flavors in every cup.",
    category: ["roaster", "thirdwave"],
    features: ["pour_over", "takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Lykke Kaffegård Nytorget",
    website: "https://www.lykkenytorget.se/",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Nytorget 4, 116 40 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.072, 59.316],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Cozy café at Nytorget serving specialty coffee and Nordic-inspired dishes. Known for their warm atmosphere and quality coffee in the heart of Södermalm.",
    category: ["specialty"],
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
        neighborhood: "Stockholm",
        coordinates: {
          type: "Point",
          coordinates: [18.01, 59.29],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique café and sandwich shop combining excellent coffee with traditional Swedish smörgås culture.",
    category: ["specialty"],
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
          coordinates: [18.082, 59.318],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Trendy coffee spot known for their modern approach to coffee and sleek Scandinavian design aesthetic.",
    category: ["thirdwave"],
    features: ["pour_over", "takeaway"],
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
        address: "Nybrokajen 7, 111 30 Stockholm",
        neighborhood: "Skeppsholmen",
        coordinates: {
          type: "Point",
          coordinates: [18.085, 59.328],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Located on the beautiful island of Skeppsholmen, this roastery represents innovative Stockholm coffee culture with waterfront views.",
    category: ["roaster", "thirdwave"],
    features: ["pour_over", "takeaway"],
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
          coordinates: [18.068, 59.316],
        },
        isMainLocation: true,
      },
    ],
    description:
      "The Coffee Missionary bringing exceptional coffee to Södermalm. A perfect blend of tradition and modern coffee culture.",
    category: ["specialty"],
    features: ["takeaway"],
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
        neighborhood: "Frihamnen",
        coordinates: {
          type: "Point",
          coordinates: [18.107, 59.349],
        },
        isMainLocation: true,
      },
    ],
    description:
      "World's most exclusive coffee, roasted on demand. Curated by coffee experts and known for their exceptional quality and unique approach to specialty coffee.",
    category: ["roaster", "thirdwave"],
    features: ["pour_over", "takeaway", "no_coffee_bar"],
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
        address: "Bastuhagsvägen 41, Stockholm",
        neighborhood: "Stockholm",
        coordinates: {
          type: "Point",
          coordinates: [18.08, 59.31],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Charming seasonal café located on Bastuhagsvägen. Open during summer months with weekend hours (Friday-Sunday 10-18). Ironically named but definitely a destination worth finding.",
    category: ["specialty"],
    features: ["takeaway"],
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
          coordinates: [18.07, 59.305],
        },
        isMainLocation: true,
      },
    ],
    description:
      "A minimal and curated space with strong focus on specialty coffee and craft beer. Perfect fusion of Stockholm's coffee and beer culture.",
    category: ["specialty"],
    features: ["outdoor_seating", "takeaway"],
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
        address: "Rådmansgatan 57, Stockholm",
        neighborhood: "Vasastan",
        coordinates: {
          type: "Point",
          coordinates: [18.065, 59.34],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Welcoming guests with exceptional coffee and warm hospitality. A neighborhood favorite that treats every visitor like a honored guest.",
    category: ["specialty"],
    features: ["takeaway", "breakfast"],
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
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.067, 59.313],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique café concept combining coffee culture with creative community space. A hub for Stockholm's artistic and creative minds.",
    category: ["specialty"],
    features: ["takeaway"],
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
          coordinates: [18.059, 59.335],
        },
        isMainLocation: true,
      },
    ],
    description:
      "The Coffee Company bringing serious coffee expertise to central Stockholm. Known for their dedication to the craft of coffee making.",
    category: ["specialty"],
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
          coordinates: [18.075, 59.335],
        },
        isMainLocation: true,
        locationNote: "Flagship store",
      },
      {
        address: "Upplandsgatan 18, 113 28 Stockholm",
        neighborhood: "Vasastan",
        coordinates: {
          type: "Point",
          coordinates: [18.058, 59.342],
        },
        isMainLocation: false,
        locationNote: "Vasastan location",
      },
      {
        address: "Hornsgatan 78, 118 21 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.052, 59.316],
        },
        isMainLocation: false,
        locationNote: "Södermalm location",
      },
      {
        address: "Götgatan 22, 116 46 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.071, 59.318],
        },
        isMainLocation: false,
        locationNote: "Götgatan location",
      },
    ],
    description:
      "Artisanal bakery serving exceptional bread, pastries, and specialty coffee. Perfect for Swedish fika tradition across multiple Stockholm locations.",
    category: ["specialty"],
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
        neighborhood: "Skeppsholmen",
        coordinates: {
          type: "Point",
          coordinates: [18.085, 59.328],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Located within the Swedish Centre for Architecture and Design, this café combines excellent coffee with stunning design in a unique museum setting.",
    category: ["specialty"],
    features: ["takeaway"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
  {
    name: "Sponge Cookies",
    website: "https://spongecookies.com",
    hasMultipleLocations: false,
    locations: [
      {
        address: "Tjärhovsgatan 19, 116 28 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.069, 59.3145],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Not a traditional café but serves specialty coffee with unique offerings. Known for their innovative approach to coffee and creative atmosphere.",
    category: ["specialty"],
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
          coordinates: [18.085, 59.34],
        },
        isMainLocation: true,
        locationNote: "Östermalm shop",
      },
      {
        address: "Renstiernas Gata 20, 116 31 Stockholm",
        neighborhood: "Södermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.09, 59.315],
        },
        isMainLocation: false,
        locationNote: "Södermalm shop",
      },
    ],
    description:
      "Artisanal cookie shop and café serving freshly baked cookies alongside specialty coffee. Known for their creative cookie flavors and cozy atmosphere.",
    category: ["specialty"],
    features: ["pastries", "takeaway", "limited_sitting"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Seed function
const seedCafes = async () => {
  try {
    await connectDB();

    // Clear existing seeded cafes (but keep user-submitted ones)
    await Cafe.deleteMany({ isSeeded: true });
    console.log("🧹 Cleared existing seed data");

    // Insert new cafes
    const insertedCafes = await Cafe.insertMany(stockholmCafes);
    console.log(
      `🌱 Successfully seeded ${insertedCafes.length} authentic Stockholm Coffee Club cafes!`
    );

    // Show what was inserted
    insertedCafes.forEach((cafe) => {
      console.log(
        `   ☕ ${cafe.name} - ${
          cafe.hasMultipleLocations
            ? `${cafe.locations.length} locations`
            : cafe.locations[0].neighborhood
        }`
      );
    });

    console.log(
      "\n🎯 Seed complete! All cafes now match your CafeSubmission.js schema exactly."
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding cafes:", error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (process.argv[1].includes("seedCafes.js")) {
  seedCafes();
}

export { seedCafes };
