import { Router } from 'express';
import { APIResponse } from '@yellorn/types';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      uptime: process.uptime(),
      services: {
        database: 'checking...',
        redis: 'checking...',
        genesisCore: 'checking...',
        stateSync: 'checking...',
        validationEngine: 'checking...'
      }
    },
    timestamp: new Date().toISOString()
  } as APIResponse);
});

healthRouter.get('/detailed', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    genesisCore: await checkService(process.env.GENESIS_CORE_URL || 'http://localhost:3001'),
    stateSync: await checkService(process.env.STATE_SYNC_URL || 'http://localhost:3002'),
    validationEngine: await checkService(process.env.VALIDATION_ENGINE_URL || 'http://localhost:3003')
  };

  const allHealthy = Object.values(checks).every(check => check.status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    data: {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      uptime: process.uptime(),
      services: checks
    },
    timestamp: new Date().toISOString()
  } as APIResponse);
});

async function checkDatabase(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const start = Date.now();
    // TODO: Implement actual database connection check
    // const result = await pool.query('SELECT 1');
    const responseTime = Date.now() - start;
    return { status: 'healthy', responseTime };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function checkRedis(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const start = Date.now();
    // TODO: Implement actual Redis connection check
    // await redisClient.ping();
    const responseTime = Date.now() - start;
    return { status: 'healthy', responseTime };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function checkService(url: string): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const start = Date.now();
    const response = await fetch(`${url}/api/health`);
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      return { status: 'healthy', responseTime };
    } else {
      return { status: 'unhealthy', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
