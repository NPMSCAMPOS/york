import { Router } from 'express';
import Joi from 'joi';
import { requireAuth } from '../middleware/auth.js';
import { generateStory } from '../services/storyService.js';

const router = Router();

const storySchema = Joi.object({
  yorkName: Joi.string().required(),
  theme: Joi.string().required(),
  ageGroup: Joi.string().optional(),
});

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { error, value } = storySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { yorkName, theme, ageGroup } = value;

  try {
    const result = await generateStory(yorkName, theme, ageGroup || '5-8 anos');
    res.status(200).json({
      story: result.story,
      tokens: result.tokens,
      elapsed: result.elapsed,
    });
  } catch (err) {
    console.error('Story generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

export default router;
