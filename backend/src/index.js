import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import yorkCharactersRoutes from './routes/yorkCharacters.js';
import storiesRoutes from './routes/stories.js';
import quizRoutes from './routes/quiz.js';

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy before rate limiting
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://york-snowy.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, trustProxy: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/york-characters', yorkCharactersRoutes);
app.use('/api/v1/stories', storiesRoutes);
app.use('/api/v1/quiz', quizRoutes);

app.listen(port, () => {
  console.log(`York backend listening on port ${port}`);
});
