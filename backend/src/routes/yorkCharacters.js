import { Router } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  appearance: Joi.object().required(),
  ageGroup: Joi.string().optional(),
});

const updateSchema = Joi.object({
  appearance: Joi.object().required(),
});

function toPublicYork(york) {
  return {
    id: york.id,
    childProfileId: york.childProfileId,
    name: york.name,
    appearance: JSON.parse(york.appearance),
    ageGroup: york.ageGroup,
    createdAt: york.createdAt,
  };
}

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, appearance, ageGroup } = value;

  let childProfile = await prisma.childProfile.findFirst({
    where: { userId: req.userId },
  });
  if (!childProfile) {
    childProfile = await prisma.childProfile.create({
      data: { userId: req.userId, name },
    });
  }

  const existing = await prisma.yorkCharacter.findUnique({
    where: { childProfileId: childProfile.id },
  });
  if (existing) {
    return res.status(409).json({ error: 'This child already has a York character' });
  }

  const york = await prisma.yorkCharacter.create({
    data: {
      childProfileId: childProfile.id,
      name,
      appearance: JSON.stringify(appearance),
      ageGroup,
    },
  });

  res.status(201).json(toPublicYork(york));
});

router.get('/:id', async (req, res) => {
  const york = await prisma.yorkCharacter.findUnique({
    where: { id: req.params.id },
    include: { childProfile: true },
  });
  if (!york || york.childProfile.userId !== req.userId) {
    return res.status(404).json({ error: 'York character not found' });
  }
  res.status(200).json(toPublicYork(york));
});

router.put('/:id', async (req, res) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existing = await prisma.yorkCharacter.findUnique({
    where: { id: req.params.id },
    include: { childProfile: true },
  });
  if (!existing || existing.childProfile.userId !== req.userId) {
    return res.status(404).json({ error: 'York character not found' });
  }

  const york = await prisma.yorkCharacter.update({
    where: { id: req.params.id },
    data: { appearance: JSON.stringify(value.appearance) },
  });

  res.status(200).json(toPublicYork(york));
});

export default router;
