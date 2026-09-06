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

// Get all stories for a user
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      include: { user: { select: { email: true } } },
    });
    res.json(stories);
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const story = await prisma.story.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (err) {
    console.error('Error fetching story:', err);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Create story (requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
        userId: req.userId,
      },
    });

    res.status(201).json(story);
  } catch (err) {
    console.error('Error creating story:', err);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Update story
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { title, content },
    });

    res.json(updatedStory);
  } catch (err) {
    console.error('Error updating story:', err);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete story
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.story.delete({
      where: { id },
    });

    res.json({ message: 'Story deleted' });
  } catch (err) {
    console.error('Error deleting story:', err);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

export default router;
