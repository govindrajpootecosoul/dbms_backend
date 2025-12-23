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

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'https://dbms-frontend-eta.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
// Explicitly handle preflight
app.options('*', cors());

// Middleware
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

// Ensure DB connects only once (works for serverless cold starts)
let dbConnectionPromise;
export const ensureDBConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

export default app;

