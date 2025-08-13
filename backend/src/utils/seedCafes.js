import mongoose from "mongoose";
import dotenv from "dotenv";
import { Cafe } from "../models/cafeModel.js";

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
    category: "roaster",
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
      "Stockholm's original specialty roastery serving consistently excellent coffee. Known for sustainable sourcing and being a cornerstone of Swedish coffee culture since 2004.",
    category: "roaster",
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
        neighborhood: "Norrmalm",
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
    category: "specialty",
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
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [18.03, 59.35],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Thirdwave coffee bar focusing on careful brewing techniques and creating the perfect cup through patience and precision.",
    category: "thirdwave",
    features: ["pour_over", "takeaway", "vegan_options"],
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
          coordinates: [18.035, 59.335],
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
          coordinates: [18.072, 59.316],
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
        neighborhood: "Enskede-Årsta-Vantörs",
        coordinates: {
          type: "Point",
          coordinates: [18.01, 59.29],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Unique café and sandwich shop combining excellent coffee with Swedish smörgås culture. A bakehouse first to Stockholm's independent restaurants with a front counter serving delicious sandwiches and fresh bagels.",
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
          coordinates: [18.082, 59.318],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Approaching coffee with a minimalist philosophy, Balue focuses on simplicity and quality. A serene spot for coffee lovers who appreciate the art of brewing.",
    category: "thirdwave",
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
        address: "Hallvägen 9 Slakthusområdet, 12162 Johanneshov",
        neighborhood: "Enskede-Årsta-Vantörs",
        coordinates: {
          type: "Point",
          coordinates: [18.085, 59.295],
        },
        isMainLocation: true,
      },
    ],
    description:
      "The OG roastery of Stockholm restaurant scene, fuelling restaurants with their own roasted coffee since 2011. They have been a staple of the restaurant scene in Stockholm for over a decade.",
    category: "roaster",
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
      "In their house, coffee is gospel. Curating a selection of coffee beans from around the world, they focus on the story behind each cup. A stepping stone for those starting their coffee journey.",
    category: "specialty",
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
        neighborhood: "Östermalm",
        coordinates: {
          type: "Point",
          coordinates: [18.107, 59.349],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Sourcing the most exceptional coffees from producers who share our vision for quality and sustainability. Through meticulous roasting, their approach combines skill, science, and storytelling to create coffees that stand out.",
    category: "roaster",
    features: ["no_coffee_bar"],
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
        neighborhood: "Norrmalm",
        coordinates: {
          type: "Point",
          coordinates: [18.08, 59.31],
        },
        isMainLocation: true,
      },
    ],
    description:
      "Deep in the suburbs, this cafe is a local favorite known for its cozy atmosphere with specialty coffee for those trying to escape the city.",
    category: "specialty",
    features: ["takeaway", "limited_sitting"],
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
      "A taproom and brewery in Södermalm, Ölkemi offers a unique experience with their own craft beers and a selection of specialty coffee. A perfect spot for those who appreciate both brews.",
    category: "specialty",
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
          coordinates: [18.065, 59.34],
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
    category: "specialty",
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
          coordinates: [18.075, 59.335],
        },
        isMainLocation: true,
        locationNote: "Flagship store",
      },
      {
        address: "Upplandsgatan 18, 113 28 Stockholm",
        neighborhood: "Norrmalm",
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
          coordinates: [18.085, 59.328],
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
    category: "specialty",
    features: ["pastries", "takeaway", "limited_sitting"],
    images: [],
    isApproved: true,
    isSeeded: true,
  },
];

// Seed function - FIXED VERSION that won't crash your server
const seedCafes = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("🚀 Connected to MongoDB (seedCafes)");
    }

    await Cafe.deleteMany({});
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

    console.log("\n🎯 Seed complete! All cafes now match your schema exactly.");

    // ✅ Return success data instead of process.exit()
    return {
      success: true,
      count: insertedCafes.length,
      message: "Seeded successfully",
    };
  } catch (error) {
    console.error("❌ Error seeding cafes:", error);
    // ✅ Throw error instead of process.exit(1)
    throw error;
  }
};

// Only run direct seeding if called from command line
if (process.argv[1].includes("seedCafes.js")) {
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("🚀 Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  };

  const runSeed = async () => {
    try {
      await connectDB();
      await seedCafes();
      process.exit(0);
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    }
  };

  runSeed();
}

// ✅ Export function properly for server use
export { seedCafes };
