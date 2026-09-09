import express from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err.message);
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
    console.error('Error fetching quiz:', err.message);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz (requires authentication)
router.post('/', requireAuth, async (req, res) => {
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
    console.error('Error creating quiz:', err.message);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Submit quiz result (requires authentication)
router.post('/:id/submit', requireAuth, async (req, res) => {
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
    console.error('Error submitting quiz result:', err.message);
    res.status(500).json({ error: 'Failed to submit quiz result' });
  }
});

// Get quiz results for user
router.get('/results/user/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only see their own results
    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const results = await prisma.quizResult.findMany({
      where: { userId },
      include: { quiz: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(results);
  } catch (err) {
    console.error('Error fetching quiz results:', err.message);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

export default router;
