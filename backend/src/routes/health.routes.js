import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Health check endpoint - testa conectividade ao banco
router.get('/db', async (req, res) => {
  console.log('🏥 [HEALTH] Verificando saúde do banco de dados...');

  try {
    // Teste simples de conectividade
    console.log('📡 [HEALTH] Executando SELECT 1 para testar conexão...');
    const result = await prisma.$queryRaw`SELECT 1`;

    console.log('✅ [HEALTH] Banco de dados conectado com sucesso');

    res.status(200).json({
      status: 'OK',
      database: 'connected',
      message: 'Database connection is working',
      timestamp: new Date().toISOString(),
      queryResult: result
    });
  } catch (error) {
    console.error('❌ [HEALTH] ERRO DE CONECTIVIDADE:');
    console.error('  📌 Mensagem:', error.message);
    console.error('  📌 Código:', error.code);
    console.error('  📌 Meta:', error.meta);
    console.error('  📌 Stack:', error.stack);

    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      meta: error.meta,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check geral da aplicação
router.get('/', (req, res) => {
  console.log('🏥 [HEALTH] Verificação geral da aplicação...');

  res.status(200).json({
    status: 'OK',
    service: 'York Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/signup, /api/auth/login, /api/auth/logout',
      health: '/api/health/, /api/health/db'
    }
  });
});

export default router;
