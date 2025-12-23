const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const animeRoutes = require('../routes/animeRoutes');
const genshinRoutes = require('../routes/genshinRoutes');
const gameRoutes = require('../routes/gameRoutes');
const credentialRoutes = require('../routes/credentialRoutes');
const kdramaRoutes = require('../routes/kdramaRoutes');
const movieRoutes = require('../routes/movieRoutes');

dotenv.config();

const app = express();

const explicitOrigins = [
  process.env.FRONTEND_ORIGIN,
  'https://dbms-frontend-eta.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

// Allow any localhost/127.0.0.1 port in dev without needing explicit config
const isLocalhost = (origin = '') =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || explicitOrigins.includes(origin) || isLocalhost(origin)) {
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

app.use((req, res, next) => {
  try {
    const requestOrigin = req.headers.origin;
    if (requestOrigin && (explicitOrigins.includes(requestOrigin) || isLocalhost(requestOrigin))) {
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
  } catch (error) {
    console.error('CORS middleware error:', error);
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Backend running on Vercel + Local');
});

app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/genshin', genshinRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/kdrama', kdramaRoutes);
app.use('/api/movies', movieRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

let dbConnectionPromise;
const ensureDBConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

// 404 handler - must return JSON
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler - ensure all errors return JSON
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Always return JSON, never HTML
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
module.exports.ensureDBConnection = ensureDBConnection;
