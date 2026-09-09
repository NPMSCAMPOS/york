import express from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(stories);
  } catch (err) {
    console.error('Error fetching stories:', err.message);
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
    console.error('Error fetching story:', err.message);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Create story (requires authentication)
router.post('/', requireAuth, async (req, res) => {
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
    console.error('Error creating story:', err.message);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Update story
router.put('/:id', requireAuth, async (req, res) => {
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
    console.error('Error updating story:', err.message);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete story
router.delete('/:id', requireAuth, async (req, res) => {
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
    console.error('Error deleting story:', err.message);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

export default router;
