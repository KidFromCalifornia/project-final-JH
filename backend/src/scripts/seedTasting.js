import connectDB from '../config/database.js';
import { User } from '../models/User.js';
import { Cafe } from '../models/cafeModel.js';
import { CoffeeTasting } from '../models/TastingsModel.js';

const deepEqual = (a, b) => {
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

const seedTastingNotes = async () => {
  let success = true;
  try {
    await connectDB();
    console.log('Connected to database for seeding tasting notes');

    const users = await User.find();
    const cafes = await Cafe.find();

    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }

    if (cafes.length === 0) {
      console.log('No cafes found. Please seed cafes first.');
      return;
    }

    console.log(`Found ${users.length} users and ${cafes.length} cafes`);

    // Helper function to get cafe neighborhood
    const getCafeNeighborhood = (cafe) => {
      if (cafe && cafe.locations && cafe.locations.length > 0) {
        return cafe.locations[0].neighborhood;
      }
      return 'unavailable'; // Default fallback
    };

    const tastingNotesData = [
      // Existing tastings with updated dates
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Drop Coffee')?._id || cafes[0]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Drop Coffee') || cafes[0]
        ),
        coffeeRoaster: 'Drop Coffee Roasters',
        coffeeOrigin: 'Ethiopia',
        coffeeOriginRegion: 'Yirgacheffe',
        coffeeName: 'Kochere Washing Station',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['fruity', 'floral', 'sweet'],
        acidity: 'medium',
        mouthFeel: 'light',
        notes: 'Absolutely incredible! Bright citrus notes with a floral finish.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Pascal')?._id || cafes[1]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Pascal') || cafes[1]),
        coffeeRoaster: 'Johan & Nyström',
        coffeeOrigin: 'Colombia',
        coffeeOriginRegion: 'Huila',
        coffeeName: 'Finca El Diviso',
        roastLevel: 'medium',
        brewMethod: 'espresso',
        rating: 4,
        tastingNotes: ['nutty', 'cocoa', 'sweet'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Perfect balance for espresso. Rich chocolate with mild acidity.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-01-22T14:15:00Z'),
        updatedAt: new Date('2024-01-22T14:15:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Johan & Nyström')?._id || cafes[2]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Johan & Nyström') || cafes[2]
        ),
        coffeeRoaster: 'Johan & Nyström',
        coffeeOrigin: 'Brazil',
        coffeeOriginRegion: 'Cerrado',
        coffeeName: 'Fazenda Santa Ines',
        roastLevel: 'medium',
        brewMethod: 'other',
        rating: 4,
        tastingNotes: ['nutty', 'cocoa', 'sweet'],
        acidity: 'light',
        mouthFeel: 'full',
        notes: 'Smooth and creamy with milk. Great for a morning cappuccino.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-02-05T09:45:00Z'),
        updatedAt: new Date('2024-02-05T09:45:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Slow Hands')?._id || cafes[3]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Slow Hands') || cafes[3]
        ),
        coffeeRoaster: 'Slow Hands Coffee',
        coffeeOrigin: 'Guatemala',
        coffeeOriginRegion: 'Antigua',
        coffeeName: 'La Azotea',
        roastLevel: 'medium',
        brewMethod: 'other',
        rating: 4,
        tastingNotes: ['cocoa', 'spices', 'sweet'],
        acidity: 'medium',
        mouthFeel: 'full',
        notes: 'Rich and complex. Perfect for a slow morning brew.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-02-12T16:20:00Z'),
        updatedAt: new Date('2024-02-12T16:20:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Volca Coffee Roasters')?._id || cafes[4]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Volca Coffee Roasters') || cafes[4]
        ),
        coffeeRoaster: 'Volca Coffee',
        coffeeOrigin: 'Kenya',
        coffeeOriginRegion: 'Nyeri',
        coffeeName: 'Tegu AA',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['fruity', 'sweet', 'other'],
        acidity: 'high',
        mouthFeel: 'medium',
        notes: 'Exceptional Kenyan coffee. Bright acidity with wine-like complexity.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-02-18T11:30:00Z'),
        updatedAt: new Date('2024-02-18T11:30:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Lykke Kaffegård - Nytorget')?._id || cafes[5]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Lykke Kaffegård - Nytorget') || cafes[5]
        ),
        coffeeRoaster: 'Lykke Coffee',
        coffeeOrigin: 'Peru',
        coffeeOriginRegion: 'Cajamarca',
        coffeeName: 'Organic Highland',
        roastLevel: 'medium',
        brewMethod: 'other',
        rating: 3,
        tastingNotes: ['nutty', 'sweet', 'other'],
        acidity: 'light',
        mouthFeel: 'medium',
        notes: 'Simple and clean. Good for an everyday americano.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-03-01T08:15:00Z'),
        updatedAt: new Date('2024-03-01T08:15:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Balue')?._id || cafes[6]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Balue') || cafes[6]),
        coffeeRoaster: 'Balue Coffee',
        coffeeOrigin: 'Brazil',
        coffeeOriginRegion: 'Sul de Minas',
        coffeeName: 'House Blend',
        roastLevel: 'medium',
        brewMethod: 'filtered coffee',
        rating: 3,
        tastingNotes: ['cocoa', 'nutty', 'sweet'],
        acidity: 'light',
        mouthFeel: 'full',
        notes: 'Minimalist approach to coffee. Works well with milk drinks.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-03-08T13:45:00Z'),
        updatedAt: new Date('2024-03-08T13:45:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Stockholm Roast')?._id || cafes[7]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Stockholm Roast') || cafes[7]
        ),
        coffeeRoaster: 'Stockholm Roast',
        coffeeOrigin: 'Rwanda',
        coffeeOriginRegion: 'Huye',
        coffeeName: 'Simbi',
        roastLevel: 'light',
        brewMethod: 'espresso',
        rating: 5,
        tastingNotes: ['fruity', 'floral', 'sweet'],
        acidity: 'high',
        mouthFeel: 'medium',
        notes: 'Stunning Rwandan coffee. Complex fruit flavors with honey sweetness.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-03-15T10:00:00Z'),
        updatedAt: new Date('2024-03-15T10:00:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Kaffemissionären')?._id || cafes[8]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Kaffemissionären') || cafes[8]
        ),
        coffeeRoaster: 'Kaffemissionären',
        coffeeOrigin: 'Honduras',
        coffeeOriginRegion: 'Santa Barbara',
        coffeeName: 'Finca La Florencia',
        roastLevel: 'medium',
        brewMethod: 'filtered coffee',
        rating: 4,
        tastingNotes: ['sweet', 'fruity', 'other'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Great balance of sweetness and acidity. Perfect with a pastry.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-03-22T15:30:00Z'),
        updatedAt: new Date('2024-03-22T15:30:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Gäst')?._id || cafes[9]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Gäst') || cafes[9]),
        coffeeRoaster: 'Gäst Coffee',
        coffeeOrigin: 'Panama',
        coffeeOriginRegion: 'Boquete',
        coffeeName: 'Geisha Varietal',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['floral', 'fruity', 'other'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Exceptional Geisha variety. Floral and tea-like with incredible complexity.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-03-29T12:00:00Z'),
        updatedAt: new Date('2024-03-29T12:00:00Z'),
      },

      // NEW TASTING ENTRIES - More diverse data with different users and dates
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Standout Coffee')?._id || cafes[10]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Standout Coffee') || cafes[10]
        ),
        coffeeRoaster: 'Standout Coffee',
        coffeeOrigin: 'Costa Rica',
        coffeeOriginRegion: 'Tarrazu',
        coffeeName: 'Villa Sarchi',
        roastLevel: 'medium',
        brewMethod: 'espresso',
        rating: 4,
        tastingNotes: ['sweet', 'cocoa', 'nutty'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Classic Costa Rican coffee. Bright and balanced with chocolate undertones.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-04-05T09:15:00Z'),
        updatedAt: new Date('2024-04-05T09:15:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Café Nowhere')?._id || cafes[11]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Café Nowhere') || cafes[11]
        ),
        coffeeRoaster: 'Local Roaster',
        coffeeOrigin: 'Mexico',
        coffeeOriginRegion: 'Chiapas',
        coffeeName: 'Finca Hamburgo',
        roastLevel: 'dark',
        brewMethod: 'filtered coffee',
        rating: 3,
        tastingNotes: ['roasted', 'cocoa', 'spices'],
        acidity: 'light',
        mouthFeel: 'full',
        notes: 'Bold and smoky. Great for those who like their coffee strong.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-04-12T14:30:00Z'),
        updatedAt: new Date('2024-04-12T14:30:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'A La Lo Café')?._id || cafes[12]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'A La Lo Café') || cafes[12]
        ),
        coffeeRoaster: 'A La Lo',
        coffeeOrigin: 'Indonesia',
        coffeeOriginRegion: 'Sumatra',
        coffeeName: 'Mandheling',
        roastLevel: 'dark',
        brewMethod: 'pour over',
        rating: 4,
        tastingNotes: ['earthy', 'spices', 'cocoa'],
        acidity: 'light',
        mouthFeel: 'full',
        notes: 'Full-bodied Sumatran with herbal and spicy notes. Very unique profile.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-04-18T11:45:00Z'),
        updatedAt: new Date('2024-04-18T11:45:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Kaffekompagniet')?._id || cafes[13]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Kaffekompagniet') || cafes[13]
        ),
        coffeeRoaster: 'Kaffekompagniet',
        coffeeOrigin: 'Uganda',
        coffeeOriginRegion: 'Bugisu',
        coffeeName: 'Sipi Falls',
        roastLevel: 'light',
        brewMethod: 'other',
        rating: 5,
        tastingNotes: ['fruity', 'floral', 'sweet'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Amazing Ugandan coffee! Bright and juicy with tropical fruit notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-04-25T16:20:00Z'),
        updatedAt: new Date('2024-04-25T16:20:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Stora Bageriet')?._id || cafes[14]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Stora Bageriet') || cafes[14]
        ),
        coffeeRoaster: 'Local Bakery Blend',
        coffeeOrigin: 'Colombia',
        coffeeOriginRegion: 'Nariño',
        coffeeName: 'Excelso',
        roastLevel: 'medium',
        brewMethod: 'filtered coffee',
        rating: 3,
        tastingNotes: ['sweet', 'nutty', 'cocoa'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Solid everyday coffee. Pairs perfectly with their fresh pastries.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-05-02T08:30:00Z'),
        updatedAt: new Date('2024-05-02T08:30:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Café Blom (ArkDes)')?._id || cafes[15]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Café Blom (ArkDes)') || cafes[15]
        ),
        coffeeRoaster: 'Museum Blend',
        coffeeOrigin: 'Ethiopia',
        coffeeOriginRegion: 'Sidamo',
        coffeeName: 'Natural Process',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 4,
        tastingNotes: ['fruity', 'floral', 'sweet'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Beautiful natural process Ethiopian. Bright and complex with berry notes.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-05-10T13:15:00Z'),
        updatedAt: new Date('2024-05-10T13:15:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Krumel Cookies')?._id || cafes[16]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Krumel Cookies') || cafes[16]
        ),
        coffeeRoaster: 'Krumel Coffee',
        coffeeOrigin: 'Guatemala',
        coffeeOriginRegion: 'Huehuetenango',
        coffeeName: 'Finca El Injerto',
        roastLevel: 'medium',
        brewMethod: 'espresso',
        rating: 4,
        tastingNotes: ['sweet', 'cocoa', 'spices'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Great espresso blend. Smooth with chocolate and subtle spice notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-05-18T10:45:00Z'),
        updatedAt: new Date('2024-05-18T10:45:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Drop Coffee')?._id || cafes[0]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Drop Coffee') || cafes[0]
        ),
        coffeeRoaster: 'Drop Coffee Roasters',
        coffeeOrigin: 'Colombia',
        coffeeOriginRegion: 'Cauca',
        coffeeName: 'La Esperanza',
        roastLevel: 'medium',
        brewMethod: 'filtered coffee',
        rating: 4,
        tastingNotes: ['sweet', 'nutty', 'cocoa'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Another great coffee from Drop. Clean and balanced with caramel sweetness.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-05-25T15:00:00Z'),
        updatedAt: new Date('2024-05-25T15:00:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Johan & Nyström')?._id || cafes[1]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Johan & Nyström') || cafes[1]
        ),
        coffeeRoaster: 'Johan & Nyström',
        coffeeOrigin: 'El Salvador',
        coffeeOriginRegion: 'Santa Ana',
        coffeeName: 'Finca El Manzano',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['fruity', 'sweet', 'floral'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Outstanding Salvadoran coffee! Bright acidity with tropical fruit and honey.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-06-01T12:30:00Z'),
        updatedAt: new Date('2024-06-01T12:30:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Pascal')?._id || cafes[2]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Pascal') || cafes[2]),
        coffeeRoaster: 'Pascal Coffee',
        coffeeOrigin: 'Nicaragua',
        coffeeOriginRegion: 'Jinotega',
        coffeeName: 'Dipilto',
        roastLevel: 'medium',
        brewMethod: 'espresso',
        rating: 3,
        tastingNotes: ['nutty', 'cocoa', 'sweet'],
        acidity: 'light',
        mouthFeel: 'full',
        notes: 'Solid Nicaraguan coffee. Good body with mild chocolate notes.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-06-08T09:00:00Z'),
        updatedAt: new Date('2024-06-08T09:00:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Slow Hands')?._id || cafes[3]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Slow Hands') || cafes[3]
        ),
        coffeeRoaster: 'Slow Hands Coffee',
        coffeeOrigin: 'Peru',
        coffeeOriginRegion: 'Cusco',
        coffeeName: 'Sacred Valley',
        roastLevel: 'light',
        brewMethod: 'other',
        rating: 4,
        tastingNotes: ['fruity', 'sweet', 'floral'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Beautiful Peruvian high-altitude coffee. Clean and bright with berry notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-06-15T14:45:00Z'),
        updatedAt: new Date('2024-06-15T14:45:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Volca Coffee Roasters')?._id || cafes[4]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Volca Coffee Roasters') || cafes[4]
        ),
        coffeeRoaster: 'Volca Coffee',
        coffeeOrigin: 'Tanzania',
        coffeeOriginRegion: 'Kilimanjaro',
        coffeeName: 'Kibo',
        roastLevel: 'medium',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['fruity', 'sweet', 'floral'],
        acidity: 'high',
        mouthFeel: 'medium',
        notes: 'Exceptional Tanzanian coffee! Bright and complex with blackcurrant and citrus.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-06-22T11:15:00Z'),
        updatedAt: new Date('2024-06-22T11:15:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Lykke Kaffegård - Nytorget')?._id || cafes[5]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Lykke Kaffegård - Nytorget') || cafes[5]
        ),
        coffeeRoaster: 'Lykke Coffee',
        coffeeOrigin: 'Vietnam',
        coffeeOriginRegion: 'Da Lat',
        coffeeName: 'Highland Blend',
        roastLevel: 'medium',
        brewMethod: 'filtered coffee',
        rating: 3,
        tastingNotes: ['nutty', 'sweet', 'cocoa'],
        acidity: 'light',
        mouthFeel: 'medium',
        notes: 'Interesting Vietnamese coffee. Mild and smooth with subtle nutty notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-06-29T16:30:00Z'),
        updatedAt: new Date('2024-06-29T16:30:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Balue')?._id || cafes[6]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Balue') || cafes[6]),
        coffeeRoaster: 'Balue Coffee',
        coffeeOrigin: 'Bolivia',
        coffeeOriginRegion: 'Caranavi',
        coffeeName: 'Organic Fair Trade',
        roastLevel: 'medium',
        brewMethod: 'other',
        rating: 4,
        tastingNotes: ['sweet', 'nutty', 'cocoa'],
        acidity: 'medium',
        mouthFeel: 'full',
        notes: 'Excellent Bolivian coffee. Smooth with chocolate and caramel notes.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-07-06T10:20:00Z'),
        updatedAt: new Date('2024-07-06T10:20:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Stockholm Roast')?._id || cafes[7]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Stockholm Roast') || cafes[7]
        ),
        coffeeRoaster: 'Stockholm Roast',
        coffeeOrigin: 'India',
        coffeeOriginRegion: 'Chikmagalur',
        coffeeName: 'Monsooned Malabar',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 4,
        tastingNotes: ['spices', 'sweet', 'other'],
        acidity: 'light',
        mouthFeel: 'medium',
        notes: 'Unique Indian monsooned coffee. Mild and smooth with subtle spice notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-07-13T13:40:00Z'),
        updatedAt: new Date('2024-07-13T13:40:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Kaffemissionären')?._id || cafes[8]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Kaffemissionären') || cafes[8]
        ),
        coffeeRoaster: 'Kaffemissionären',
        coffeeOrigin: 'Yemen',
        coffeeOriginRegion: 'Haraaz',
        coffeeName: 'Mocha Sanani',
        roastLevel: 'medium',
        brewMethod: 'espresso',
        rating: 5,
        tastingNotes: ['spices', 'sweet', 'cocoa'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Incredible Yemeni coffee! Complex spice profile with chocolate and fruit notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-07-20T15:55:00Z'),
        updatedAt: new Date('2024-07-20T15:55:00Z'),
      },
      {
        userId: users[1 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Gäst')?._id || cafes[9]._id,
        cafeNeighborhood: getCafeNeighborhood(cafes.find((c) => c.name === 'Gäst') || cafes[9]),
        coffeeRoaster: 'Gäst Coffee',
        coffeeOrigin: 'Ecuador',
        coffeeOriginRegion: 'Pichincha',
        coffeeName: 'Super Mario',
        roastLevel: 'light',
        brewMethod: 'pour over',
        rating: 4,
        tastingNotes: ['fruity', 'floral', 'sweet'],
        acidity: 'high',
        mouthFeel: 'light',
        notes: 'Beautiful Ecuadorian high-altitude coffee. Bright and clean with floral notes.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-07-27T12:10:00Z'),
        updatedAt: new Date('2024-07-27T12:10:00Z'),
      },
      {
        userId: users[2 % users.length]._id,
        cafeId: cafes.find((c) => c.name === 'Standout Coffee')?._id || cafes[10]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Standout Coffee') || cafes[10]
        ),
        coffeeRoaster: 'Standout Coffee',
        coffeeOrigin: 'Hawaii',
        coffeeOriginRegion: 'Kona',
        coffeeName: 'Kona Extra Fancy',
        roastLevel: 'light',
        brewMethod: 'filtered coffee',
        rating: 4,
        tastingNotes: ['sweet', 'nutty', 'cocoa'],
        acidity: 'medium',
        mouthFeel: 'medium',
        notes: 'Premium Hawaiian coffee. Smooth and rich with caramel sweetness.',
        isPublic: false,
        isSeeded: true,
        createdAt: new Date('2024-08-03T09:25:00Z'),
        updatedAt: new Date('2024-08-03T09:25:00Z'),
      },
      {
        userId: users[0]._id,
        cafeId: cafes.find((c) => c.name === 'Café Nowhere')?._id || cafes[11]._id,
        cafeNeighborhood: getCafeNeighborhood(
          cafes.find((c) => c.name === 'Café Nowhere') || cafes[11]
        ),
        coffeeRoaster: 'Café Nowhere',
        coffeeOrigin: 'Jamaica',
        coffeeOriginRegion: 'Blue Mountain',
        coffeeName: 'Blue Mountain No. 1',
        roastLevel: 'medium',
        brewMethod: 'pour over',
        rating: 5,
        tastingNotes: ['sweet', 'nutty', 'floral'],
        acidity: 'light',
        mouthFeel: 'medium',
        notes: 'Exceptional Jamaican Blue Mountain! Smooth, mild, and incredibly refined.',
        isPublic: true,
        isSeeded: true,
        createdAt: new Date('2024-08-10T14:50:00Z'),
        updatedAt: new Date('2024-08-10T14:50:00Z'),
      },
    ]; // Fetch all tasting notes from DB
    const dbTastings = await CoffeeTasting.find({}).lean();
    // Use a composite key for matching: userId, cafeId, coffeeName
    const dbTastingMap = new Map(
      dbTastings.map((t) => [`${t.userId}_${t.cafeId}_${t.coffeeName}`, t])
    );

    const tastingsToInsert = [];
    const tastingsToUpdate = [];

    for (const note of tastingNotesData) {
      const key = `${note.userId}_${note.cafeId}_${note.coffeeName}`;
      const dbNote = dbTastingMap.get(key);
      if (!dbNote) {
        tastingsToInsert.push(note);
      } else {
        const { _id, ...dbNoteData } = dbNote;
        if (!deepEqual(dbNoteData, note)) {
          tastingsToUpdate.push({ _id, ...note });
        }
      }
    }

    if (tastingsToInsert.length === 0 && tastingsToUpdate.length === 0) {
      console.log('No new or changed tasting notes to seed. All tasting notes are up to date.');
      return;
    }

    // Insert new tasting notes
    if (tastingsToInsert.length > 0) {
      const inserted = await CoffeeTasting.insertMany(tastingsToInsert);
      console.log(`🌱 Inserted ${inserted.length} new tasting notes.`);
    }
    // Update changed tasting notes
    if (tastingsToUpdate.length > 0) {
      for (const note of tastingsToUpdate) {
        await CoffeeTasting.findByIdAndUpdate(note._id, note, { new: true });
        console.log(`🔄 Updated tasting note for user ${note.userId} at cafe ${note.cafeId}`);
      }
    }
  } catch (error) {
    console.error('Error seeding tasting notes:', error);
    success = false;
  } finally {
    process.exit(success ? 0 : 1);
  }
};
seedTastingNotes();
export default seedTastingNotes;
