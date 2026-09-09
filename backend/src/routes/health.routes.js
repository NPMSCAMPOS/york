import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Health check endpoint - test database connectivity
router.get('/db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'OK',
      database: 'connected',
      message: 'Database connection is working',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);

    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// General health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'York Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth/signup, /api/v1/auth/login, /api/v1/auth/logout',
      stories: '/api/v1/stories',
      quiz: '/api/v1/quiz',
      characters: '/api/v1/york-characters',
      health: '/api/v1/health, /api/v1/health/db',
    },
  });
});

export default router;
