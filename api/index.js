import app, { ensureDBConnection } from '../app.js';

// Ensure database is connected on cold start before handling requests
await ensureDBConnection();

// Export the Express app for Vercel's serverless runtime
export default app;
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import authRoutes from '../routes/authRoutes.js';
import animeRoutes from '../routes/animeRoutes.js';
import genshinRoutes from '../routes/genshinRoutes.js';
import gameRoutes from '../routes/gameRoutes.js';
import credentialRoutes from '../routes/credentialRoutes.js';
import kdramaRoutes from '../routes/kdramaRoutes.js';
import movieRoutes from '../routes/movieRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/genshin', genshinRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/kdrama', kdramaRoutes);
app.use('/api/movies', movieRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'DBMS Portal API is running' });
});

// Connect to database (cached connection for serverless)
let dbConnected = false;
let dbConnecting = false;

const connectDatabase = async () => {
  // If already connected, return
  if (dbConnected) {
    return;
  }
  
  // If currently connecting, wait
  if (dbConnecting) {
    while (dbConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  // Start connection
  dbConnecting = true;
  try {
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    dbConnected = false;
    // Don't throw - let the request continue, connection will retry on next request
  } finally {
    dbConnecting = false;
  }
};

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to database (will use cached connection if already connected)
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Continue anyway - some routes might not need DB
  }
  
  // Handle the request with Express app
  return app(req, res);
}

