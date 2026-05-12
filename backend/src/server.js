import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { seedCafes } from './scripts/seedCafes.js';
import { Cafe } from './models/cafeModel.js';
import { CoffeeTasting } from './models/TastingsModel.js';
import { User } from './models/User.js';

// Import models to register them
import './models/cafeModel.js';
import './models/TastingsModel.js';
import './models/User.js';

// Import routes
import cafeRoutes from './routes/cafes.js';
import authRoutes from './routes/auth.js';
import tastingRoutes from './routes/UserTastings.js';
import metadataRoutes from './routes/metadata.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define backup ports in case primary port is busy
const backupPorts = [PORT, 3002, 3003, 3004, 3005];

// Function to try starting server on different ports
const startServerWithBackup = (app, ports, index = 0) => {
  if (index >= ports.length) {
    console.error('❌ All backup ports are busy. Could not start server.');
    process.exit(1);
  }

  const currentPort = ports[index];
  const server = app.listen(currentPort, () => {
    console.log(`🚀 Server running on http://localhost:${currentPort}`);
    if (index > 0) {
      console.log(`⚠️  Primary port was busy, using backup port ${currentPort}`);
    }
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`☕ Stockholm Coffee Club API ready!`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${currentPort} is busy, trying next port...`);
      startServerWithBackup(app, ports, index + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return server;
};

app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // React default dev server
      'https://stockholmscoffeeclub.netlify.app',
      'https://stockholmscoffeeclub.netlify.app/',
      'https://stockholmscoffeeclub.com',
      'https://www.stockholmscoffeeclub.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Health check endpoint (before DB connection for immediate availability)
app.get('/healthz', (_, res) => {
  res.status(200).send('OK');
});

// Basic route
app.get('/', (_, res) => {
  res.json({
    message: 'welcome to the Stockholm Coffee Club API! ☕',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});

// API Documentation endpoint
app.get('/api', (_, res) => {
  res.json({
    message: 'Stockholm Coffee Club API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
      },
      cafes: {
        'GET /api/cafes': 'Get all cafes',
        'GET /api/cafes/:id': 'Get cafe by ID',
        'POST /api/cafes': 'Create new cafe (admin only)',
      },
      tastings: {
        'GET /api/tastings/public': 'Get public tasting notes',
        'GET /api/tastings/public/search': 'Search public tastings',
        'GET /api/tastings': "Get user's tastings (auth required)",
        'POST /api/tastings': 'Create new tasting (username optional)',
        'PUT /api/tastings/:id': 'Update tasting (auth required)',
        'DELETE /api/tastings/:id': 'Delete tasting (auth required)',
      },
      utils: {
        'GET /api/seed': 'Seed Stockholm cafes',
      },
    },
  });
});

// Connect to DB and then register routes + start server
connectDB()
  .then(() => {
    // Register routes only after DB connection
    app.use('/api/cafes', cafeRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/tastings', tastingRoutes);
    app.use('/api/metadata', metadataRoutes);

    // Seed cafes
    app.get('/api/seed', async (_, res) => {
      try {
        const result = await seedCafes();
        res.json({ message: 'Stockholm cafes seeded successfully! ☕', success: true, count: result.count });
      } catch (error) {
        res.status(500).json({ error: error.message, success: false });
      }
    });

    // Seed sample tastings (uses existing cafes + anonymous user)
    app.get('/api/seed/tastings', async (_, res) => {
      try {
        const cafes = await Cafe.find();
        if (cafes.length === 0) {
          return res.status(400).json({ success: false, error: 'Seed cafes first via /api/seed' });
        }

        // Find or create the Anonymous user
        let anonUser = await User.findOne({ username: 'Anonymous' });
        if (!anonUser) anonUser = await User.create({ username: 'Anonymous' });

        const getCafe = (name) => cafes.find((c) => c.name === name) || cafes[Math.floor(Math.random() * cafes.length)];
        const getNeighborhood = (cafe) => cafe?.locations?.[0]?.neighborhood || '';

        const samples = [
          { cafe: 'Drop Coffee', roaster: 'Drop Coffee Roasters', origin: 'Ethiopia', region: 'Yirgacheffe', name: 'Kochere', roast: 'light', brew: 'pour over', rating: 5, notes: ['fruity','floral','sweet'], acidity: 'high', feel: 'light', text: 'Bright citrus notes with a floral finish. Stunning.' },
          { cafe: 'Pascal', roaster: 'Johan & Nyström', origin: 'Colombia', region: 'Huila', name: 'Finca El Diviso', roast: 'medium', brew: 'espresso', rating: 4, notes: ['nutty','cocoa','sweet'], acidity: 'medium', feel: 'medium', text: 'Perfect balance. Rich chocolate with mild acidity.' },
          { cafe: 'Slow Hands', roaster: 'Slow Hands Coffee', origin: 'Guatemala', region: 'Antigua', name: 'La Azotea', roast: 'medium', brew: 'other', rating: 4, notes: ['cocoa','spices','sweet'], acidity: 'medium', feel: 'full', text: 'Rich and complex. Perfect for a slow morning brew.' },
          { cafe: 'Volca Coffee Roasters', roaster: 'Volca Coffee', origin: 'Kenya', region: 'Nyeri', name: 'Tegu AA', roast: 'light', brew: 'pour over', rating: 5, notes: ['fruity','sweet','other'], acidity: 'high', feel: 'medium', text: 'Exceptional Kenyan. Bright acidity with wine-like complexity.' },
          { cafe: 'Stockholm Roast', roaster: 'Stockholm Roast', origin: 'Rwanda', region: 'Huye', name: 'Simbi', roast: 'light', brew: 'espresso', rating: 5, notes: ['fruity','floral','sweet'], acidity: 'high', feel: 'medium', text: 'Complex fruit flavors with honey sweetness.' },
          { cafe: 'Gäst', roaster: 'Gäst Coffee', origin: 'Panama', region: 'Boquete', name: 'Geisha Varietal', roast: 'light', brew: 'pour over', rating: 5, notes: ['floral','fruity','other'], acidity: 'high', feel: 'light', text: 'Floral and tea-like with incredible complexity.' },
          { cafe: 'Standout Coffee', roaster: 'Standout Coffee', origin: 'Costa Rica', region: 'Tarrazu', name: 'Villa Sarchi', roast: 'medium', brew: 'espresso', rating: 4, notes: ['sweet','cocoa','nutty'], acidity: 'medium', feel: 'medium', text: 'Bright and balanced with chocolate undertones.' },
          { cafe: 'A La Lo Café', roaster: 'A La Lo', origin: 'Indonesia', region: 'Sumatra', name: 'Mandheling', roast: 'dark', brew: 'pour over', rating: 4, notes: ['earthy','spices','cocoa'], acidity: 'light', feel: 'full', text: 'Full-bodied with herbal and spicy notes. Very unique.' },
          { cafe: 'Kaffemissionären', roaster: 'Kaffemissionären', origin: 'Yemen', region: 'Haraaz', name: 'Mocha Sanani', roast: 'medium', brew: 'espresso', rating: 5, notes: ['spices','sweet','cocoa'], acidity: 'medium', feel: 'medium', text: 'Incredible complexity — spice, chocolate, and fruit.' },
          { cafe: 'Balue', roaster: 'Balue Coffee', origin: 'Bolivia', region: 'Caranavi', name: 'Organic Fair Trade', roast: 'medium', brew: 'filtered coffee', rating: 4, notes: ['sweet','nutty','cocoa'], acidity: 'medium', feel: 'full', text: 'Smooth with chocolate and caramel notes.' },
        ];

        const toInsert = [];
        for (const s of samples) {
          const cafe = getCafe(s.cafe);
          const exists = await CoffeeTasting.findOne({ cafeId: cafe._id, coffeeName: s.name, isSeeded: true });
          if (!exists) {
            toInsert.push({
              userId: anonUser._id,
              username: 'Anonymous',
              cafeId: cafe._id,
              cafeNeighborhood: getNeighborhood(cafe),
              coffeeRoaster: s.roaster,
              coffeeOrigin: s.origin,
              coffeeOriginRegion: s.region,
              coffeeName: s.name,
              roastLevel: s.roast,
              brewMethod: s.brew,
              rating: s.rating,
              tastingNotes: s.notes,
              acidity: s.acidity,
              mouthFeel: s.feel,
              notes: s.text,
              isPublic: true,
              isSeeded: true,
            });
          }
        }

        if (toInsert.length > 0) await CoffeeTasting.insertMany(toInsert);
        res.json({ success: true, message: `Seeded ${toInsert.length} tastings`, count: toInsert.length });
      } catch (error) {
        res.status(500).json({ error: error.message, success: false });
      }
    });

    // Add simple error handling
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });

    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      });
    });

    // Start server with backup port functionality
    startServerWithBackup(app, backupPorts);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default connectDB;
