import connectDB from "../config/database.js";
import { User } from "../models/User.js";
import { Cafe } from "../models/cafeModel.js";
import { CoffeeTasting } from "../models/TastingsModel.js";

const seedTastingNotes = async () => {
  try {
    await connectDB();
    console.log("Connected to database for seeding tasting notes");

    const users = await User.find();
    const cafes = await Cafe.find();

    if (users.length === 0) {
      console.log("No users found. Please seed users first.");
      return;
    }

    if (cafes.length === 0) {
      console.log("No cafes found. Please seed cafes first.");
      return;
    }

    console.log(`Found ${users.length} users and ${cafes.length} cafes`);

    // Helper function to get cafe neighborhood
    const getCafeNeighborhood = (cafe) => {
      if (cafe && cafe.locations && cafe.locations.length > 0) {
        return cafe.locations[0].neighborhood;
      }
      return "unavailable"; // Default fallback
    };

    const tastingNotesData = [
      {
        userId: users[0]._id,
        cafeId:
          cafes.find((c) => c.name === "Drop Coffee")?._id || cafes[0]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Drop Coffee") || cafes[0]
        ),
        coffeeRoaster: "Drop Coffee Roasters",
        coffeeOrigin: "Ethiopia",
        coffeeOriginRegion: "Yirgacheffe",
        coffeeName: "Kochere Washing Station",
        roastLevel: "light",
        brewMethod: "pour over",
        rating: 5,
        tastingNotes: ["fruity", "floral", "sweet"], // Only use category titles from model
        acidity: "medium",
        mouthFeel: "light",
        notes:
          "Absolutely incredible! Bright citrus notes with a floral finish.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === "Pascal")?._id || cafes[1]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Pascal") || cafes[1]
        ),
        coffeeRoaster: "Johan & Nyström",
        coffeeOrigin: "Colombia",
        coffeeOriginRegion: "Huila",
        coffeeName: "Finca El Diviso",
        roastLevel: "medium",
        brewMethod: "espresso",
        rating: 4,
        tastingNotes: ["nutty", "cocoa", "sweet"],
        acidity: "medium",
        mouthFeel: "medium",
        notes:
          "Perfect balance for espresso. Rich chocolate with mild acidity.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[1 % users.length]._id,
        cafeId:
          cafes.find((c) => c.name === "Johan & Nyström")?._id || cafes[2]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Johan & Nyström") || cafes[2]
        ),
        coffeeRoaster: "Johan & Nyström",
        coffeeOrigin: "Brazil",
        coffeeOriginRegion: "Cerrado",
        coffeeName: "Fazenda Santa Ines",
        roastLevel: "medium",
        brewMethod: "other",
        rating: 4,
        tastingNotes: ["nutty", "cocoa", "sweet"],
        acidity: "light",
        mouthFeel: "full",
        notes: "Smooth and creamy with milk. Great for a morning cappuccino.",
        isPublic: false,
        isSeeded: true,
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === "Slow Hands")?._id || cafes[3]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Slow Hands") || cafes[3]
        ),
        coffeeRoaster: "Slow Hands Coffee",
        coffeeOrigin: "Guatemala",
        coffeeOriginRegion: "Antigua",
        coffeeName: "La Azotea",
        roastLevel: "medium",
        brewMethod: "other",
        rating: 4,
        tastingNotes: ["cocoa", "spices", "sweet"],
        acidity: "medium",
        mouthFeel: "full",
        notes: "Rich and complex. Perfect for a slow morning brew.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[2 % users.length]._id,
        cafeId:
          cafes.find((c) => c.name === "Volca Coffee Roaster")?._id ||
          cafes[4]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Volca Coffee Roaster") || cafes[4]
        ),
        coffeeRoaster: "Volca Coffee",
        coffeeOrigin: "Kenya",
        coffeeOriginRegion: "Nyeri",
        coffeeName: "Tegu AA",
        roastLevel: "light",
        brewMethod: "pour over",
        rating: 5,
        tastingNotes: ["fruity", "sweet", "other"],
        acidity: "high",
        mouthFeel: "medium",
        notes:
          "Exceptional Kenyan coffee. Bright acidity with wine-like complexity.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId:
          cafes.find((c) => c.name === "Lykke Kaffegård - Nytorget")?._id ||
          cafes[5]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Lykke Kaffegård - Nytorget") || cafes[5]
        ),
        coffeeRoaster: "Lykke Coffee",
        coffeeOrigin: "Peru",
        coffeeOriginRegion: "Cajamarca",
        coffeeName: "Organic Highland",
        roastLevel: "medium",
        brewMethod: "other",
        rating: 3,
        tastingNotes: ["nutty", "sweet", "other"],
        acidity: "light",
        mouthFeel: "medium",
        notes: "Simple and clean. Good for an everyday americano.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === "Balue")?._id || cafes[6]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Balue") || cafes[6]
        ),
        coffeeRoaster: "Balue Coffee",
        coffeeOrigin: "Brazil",
        coffeeOriginRegion: "Sul de Minas",
        coffeeName: "House Blend",
        roastLevel: "medium",
        brewMethod: "filtered coffee",
        rating: 3,
        tastingNotes: ["cocoa", "nutty", "sweet"],
        acidity: "light",
        mouthFeel: "full",
        notes: "Minimalist approach to coffee. Works well with milk drinks.",
        isPublic: false,
        isSeeded: true,
      },
      {
        userId: users[2 % users.length]._id,
        cafeId:
          cafes.find((c) => c.name === "Stockholm Roast")?._id || cafes[7]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Stockholm Roast") || cafes[7]
        ),
        coffeeRoaster: "Stockholm Roast",
        coffeeOrigin: "Rwanda",
        coffeeOriginRegion: "Huye",
        coffeeName: "Simbi",
        roastLevel: "light",
        brewMethod: "espresso",
        rating: 5,
        tastingNotes: ["fruity", "floral", "sweet"],
        acidity: "high",
        mouthFeel: "medium",
        notes:
          "Stunning Rwandan coffee. Complex fruit flavors with honey sweetness.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[0]._id,
        cafeId:
          cafes.find((c) => c.name === "Kaffemissionären")?._id || cafes[8]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Kaffemissionären") || cafes[8]
        ),
        coffeeRoaster: "Kaffemissionären",
        coffeeOrigin: "Honduras",
        coffeeOriginRegion: "Santa Barbara",
        coffeeName: "Finca La Florencia",
        roastLevel: "medium",
        brewMethod: "filtered coffee",
        rating: 4,
        tastingNotes: ["sweet", "fruity", "other"],
        acidity: "medium",
        mouthFeel: "medium",
        notes: "Great balance of sweetness and acidity. Perfect with a pastry.",
        isPublic: true,
        isSeeded: true,
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === "Gäst")?._id || cafes[9]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === "Gäst") || cafes[9]
        ),
        coffeeRoaster: "Gäst Coffee",
        coffeeOrigin: "Panama",
        coffeeOriginRegion: "Boquete",
        coffeeName: "Geisha Varietal",
        roastLevel: "light",
        brewMethod: "pour over",
        rating: 5,
        tastingNotes: ["floral", "fruity", "other"],
        acidity: "high",
        mouthFeel: "light",
        notes:
          "Exceptional Geisha variety. Floral and tea-like with incredible complexity.",
        isPublic: true,
        isSeeded: true,
      },
    ];

    // Create tasting notes
    const createdTastingNotes = await CoffeeTasting.insertMany(
      tastingNotesData
    );
    console.log(
      `Successfully seeded ${createdTastingNotes.length} tasting notes`
    );
  } catch (error) {
    console.error("Error seeding tasting notes:", error);
  }
};
seedTastingNotes();
export default seedTastingNotes;
