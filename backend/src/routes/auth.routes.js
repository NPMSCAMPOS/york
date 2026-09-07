import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema
const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 [SIGNUP] Iniciando signup...');
    const { error, value } = authSchema.validate(req.body);
    if (error) {
      console.log('❌ [SIGNUP] Validação falhou:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    console.log('✅ [SIGNUP] Validação OK - Email:', email);

    // Check if user already exists
    console.log('🔍 [SIGNUP] Verificando se usuário já existe...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ [SIGNUP] Usuário já existe:', email);
      return res.status(409).json({ error: 'User already exists' });
    }
    console.log('✅ [SIGNUP] Usuário não existe - prosseguindo');

    // Hash password
    console.log('🔐 [SIGNUP] Fazendo hash da senha...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [SIGNUP] Senha hasheada com sucesso');

    // Create user
    console.log('💾 [SIGNUP] Criando usuário no banco de dados...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log('✅ [SIGNUP] Usuário criado com sucesso:', user.id);

    // Generate JWT token
    console.log('🔑 [SIGNUP] Gerando token JWT...');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ [SIGNUP] Signup concluído com sucesso');
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('❌ [SIGNUP] ERRO CRÍTICO:');
    console.error('  📌 Mensagem:', err.message);
    console.error('  📌 Código:', err.code);
    console.error('  📌 Meta:', err.meta);
    console.error('  📌 Stack:', err.stack);
    console.error('  📌 Cliente Prisma:', err.clientVersion);

    // Log adicional para diagnóstico
    if (err.code === 'P2002') {
      console.error('  💡 DICA: Constraint único violado - campo já existe');
    } else if (err.code === 'P2021') {
      console.error('  💡 DICA: Campo não existe no schema do banco');
    } else if (err.code === 'P1000') {
      console.error('  💡 DICA: Erro de autenticação ao banco de dados');
    } else if (err.code === 'P1001') {
      console.error('  💡 DICA: Não consegue alcançar o servidor de banco de dados');
    }

    res.status(500).json({
      error: 'Failed to create user',
      details: err.message,
      code: err.code,
      meta: err.meta
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Logout endpoint (simple endpoint, actual logout handled on frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
