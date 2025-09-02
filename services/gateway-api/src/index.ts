import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import winston from 'winston';
import { APIResponse } from '@yellorn/types';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestValidator } from './middleware/validator';
import { socketHandler } from './sockets/socketHandler';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';

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
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  } as APIResponse
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for sensitive endpoints
  message: {
    success: false,
    error: 'Too many requests for this endpoint, please try again later.',
    timestamp: new Date().toISOString()
  } as APIResponse
});

app.use('/api/', limiter);
app.use('/api/auth/', strictLimiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Protected routes (require authentication)
app.use('/api/protected', authMiddleware);

// Service proxies
const genesisProxy = createProxyMiddleware({
  target: process.env.GENESIS_CORE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/universe': '/api'
  },
  onError: (err, req, res) => {
    logger.error('Genesis Core proxy error:', err);
    res.status(503).json({
      success: false,
      error: 'Genesis Core service unavailable',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});

const stateSyncProxy = createProxyMiddleware({
  target: process.env.STATE_SYNC_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/sync': '/api'
  },
  onError: (err, req, res) => {
    logger.error('State Sync proxy error:', err);
    res.status(503).json({
      success: false,
      error: 'State Sync service unavailable',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});

const validationProxy = createProxyMiddleware({
  target: process.env.VALIDATION_ENGINE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/validate': '/api'
  },
  onError: (err, req, res) => {
    logger.error('Validation Engine proxy error:', err);
    res.status(503).json({
      success: false,
      error: 'Validation Engine service unavailable',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});

// Apply proxies
app.use('/api/universe', authMiddleware, genesisProxy);
app.use('/api/sync', authMiddleware, stateSyncProxy);
app.use('/api/validate', authMiddleware, validationProxy);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Yellorn Gateway API',
      version: '0.1.0',
      description: 'API Gateway for Yellorn digital universe',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        universe: '/api/universe',
        sync: '/api/sync',
        validate: '/api/validate'
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

// Error handling middleware
app.use(errorHandler);

// Socket.IO setup
socketHandler(io, logger);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  logger.info(`🚀 Yellorn Gateway API server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Genesis Core: ${process.env.GENESIS_CORE_URL || 'http://localhost:3001'}`);
  logger.info(`🔄 State Sync: ${process.env.STATE_SYNC_URL || 'http://localhost:3002'}`);
  logger.info(`✅ Validation: ${process.env.VALIDATION_ENGINE_URL || 'http://localhost:3003'}`);
});

export default app;
