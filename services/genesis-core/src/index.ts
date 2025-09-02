import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import winston from 'winston';
import { APIResponse, AgentState, UniverseState } from '@yellorn/types';
import { bodyRouter } from './routes/bodies';
import { agentRouter } from './routes/agents';
import { universeRouter } from './routes/universe';
import { UniverseEngine } from './engine/UniverseEngine';
import { BodyManager } from './managers/BodyManager';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize core systems
const universeEngine = new UniverseEngine(logger);
const bodyManager = new BodyManager(logger);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'genesis-core',
      status: 'healthy',
      version: '0.1.0',
      uptime: process.uptime(),
      universe: {
        activeAgents: universeEngine.getActiveAgentCount(),
        lastUpdate: universeEngine.getLastUpdateTime(),
        shardId: 'genesis'
      }
    },
    timestamp: new Date().toISOString()
  } as APIResponse);
});

// API Routes
app.use('/api/bodies', bodyRouter(bodyManager, logger));
app.use('/api/agents', agentRouter(universeEngine, logger));
app.use('/api/universe', universeRouter(universeEngine, logger));

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'Yellorn Genesis Core',
      version: '0.1.0',
      description: 'Core universe logic and agent embodiment service',
      endpoints: {
        health: '/api/health',
        bodies: '/api/bodies',
        agents: '/api/agents',
        universe: '/api/universe'
      }
    },
    timestamp: new Date().toISOString()
  } as APIResponse);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  } as APIResponse);
});

// Error handling
app.use(errorHandler);

// Start universe engine
universeEngine.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await universeEngine.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await universeEngine.stop();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`🌍 Yellorn Genesis Core service running on port ${PORT}`);
  logger.info(`🎮 Universe Engine: ${universeEngine.isRunning() ? 'Running' : 'Stopped'}`);
  logger.info(`📦 Body Manager: Initialized`);
});

export default app;
