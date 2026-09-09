import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import yorkCharactersRoutes from './routes/yorkCharacters.js';
import storiesRoutes from './routes/stories.js';
import quizRoutes from './routes/quiz.js';
import healthRoutes from './routes/health.routes.js';

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy before rate limiting
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://york-snowy.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  trustProxy: true,
});

// Rate limiting - stricter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  trustProxy: true,
  skipSuccessfulRequests: false,
});

// Apply rate limiting
app.use(generalLimiter);

// Health check endpoints - without rate limiting
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// Simple root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'York Backend',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes with stricter rate limiting
app.use('/api/v1/auth', authLimiter, authRoutes);

// API routes
app.use('/api/v1/york-characters', yorkCharactersRoutes);
app.use('/api/v1/stories', storiesRoutes);
app.use('/api/v1/quiz', quizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`✅ York backend listening on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? 'configured' : 'NOT SET - AUTH WILL FAIL'}`);
});
