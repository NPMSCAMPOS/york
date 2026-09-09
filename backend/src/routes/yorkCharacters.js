import express from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all York characters
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.yorkCharacter.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err.message);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Get character by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await prisma.yorkCharacter.findUnique({
      where: { id },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (err) {
    console.error('Error fetching character:', err.message);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Create character (admin only - requires authentication for now)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const character = await prisma.yorkCharacter.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    res.status(201).json(character);
  } catch (err) {
    console.error('Error creating character:', err.message);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

export default router;
