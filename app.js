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

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin (no origin header) and known origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Manual headers fallback to ensure every response carries CORS headers
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('DBMS backend is running. Use /api/* endpoints.');
});
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

// Fallback for favicon to reduce noise
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Ensure DB connects only once (works for serverless cold starts)
let dbConnectionPromise;
export const ensureDBConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

export default app;

