// ...existing code...
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { seedCafes } from './scripts/seedCafes.js';

// Import routes
import cafeRoutes from './routes/cafes.js';
import authRoutes from './routes/auth.js';
import submissionRoutes from './routes/cafeSubmissions.js';
import tastingRoutes from './routes/UserTastings.js';
import metadataRoutes from './routes/metadata.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

const primaryPort = process.env.PORT || 3001;
const backupPorts = [primaryPort, 3002, 3003, 3004, 3005];
const app = express();

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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
        'POST /api/tastings': 'Create new tasting (auth required)',
        'PUT /api/tastings/:id': 'Update tasting (auth required)',
        'DELETE /api/tastings/:id': 'Delete tasting (auth required)',
      },
      submissions: {
        'GET /api/cafeSubmissions': 'Get cafe submissions (admin only)',
        'POST /api/cafeSubmissions': 'Submit new cafe',
        'PUT /api/cafeSubmissions/:id/approve': 'Approve submission (admin only)',
        'DELETE /api/cafeSubmissions/:id': 'Delete submission (admin only)',
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
    app.use('/api/cafeSubmissions', submissionRoutes);
    app.use('/api/tastings', tastingRoutes);
    app.use('/api/metadata', metadataRoutes);

    // Seed endpoint
    app.get('/api/seed', async (_, res) => {
      try {
        const result = await seedCafes();
        res.json({
          message: 'Stockholm cafes seeded successfully! ☕',
          success: true,
          count: result.count,
        });
      } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
          error: error.message,
          success: false,
        });
      }
    });

    // Add global error handling middleware
    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    // Start server with backup port functionality
    startServerWithBackup(app, backupPorts);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
app.get('/healthz', (_, res) => {
  res.status(200).send('OK');
});

export default connectDB;
