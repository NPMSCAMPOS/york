import { Router } from 'express';
import Joi from 'joi';
import { requireAuth } from '../middleware/auth.js';
import { generateQuizQuestion, validateQuizAnswer } from '../services/quizService.js';

const router = Router();

const generateSchema = Joi.object({
  yorkName: Joi.string().required(),
  ageGroup: Joi.string().optional(),
});

const validateSchema = Joi.object({
  quizId: Joi.string().required(),
  answer: Joi.string().required(),
  correctAnswer: Joi.string().required(),
});

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { error, value } = generateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { yorkName, ageGroup } = value;

  try {
    const quiz = await generateQuizQuestion(yorkName, ageGroup);
    res.status(200).json(quiz);
  } catch (err) {
    console.error('Quiz generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

router.post('/validate', async (req, res) => {
  const { error, value } = validateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { quizId, answer, correctAnswer } = value;

  try {
    const result = await validateQuizAnswer(quizId, answer, correctAnswer);
    res.status(200).json(result);
  } catch (err) {
    console.error('Quiz validation error:', err.message);
    res.status(500).json({ error: 'Failed to validate answer' });
  }
});

export default router;
