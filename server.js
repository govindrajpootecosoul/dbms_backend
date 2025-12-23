import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import genshinRoutes from './routes/genshinRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import credentialRoutes from './routes/credentialRoutes.js';
import kdramaRoutes from './routes/kdramaRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/genshin', genshinRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/kdrama', kdramaRoutes);
app.use('/api/movies', movieRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 5012;

// Start server only after database connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start server after database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

