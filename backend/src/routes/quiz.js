import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: JSON.stringify(questions),
      },
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Submit quiz result (requires authentication)
router.post('/:id/submit', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, answers } = req.body;

    if (score === undefined || !answers) {
      return res.status(400).json({ error: 'Score and answers are required' });
    }

    const result = await prisma.quizResult.create({
      data: {
        userId: req.userId,
        quizId: id,
        score,
        answers: JSON.stringify(answers),
      },
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Error submitting quiz result:', err);
    res.status(500).json({ error: 'Failed to submit quiz result' });
  }
});

// Get quiz results for user
router.get('/results/user', verifyToken, async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: { userId: req.userId },
      include: { quiz: true },
    });

    res.json(results);
  } catch (err) {
    console.error('Error fetching quiz results:', err);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

export default router;
