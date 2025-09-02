import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APIResponse } from '@yellorn/types';
import { validateRequest } from '../middleware/validator';
import Joi from 'joi';

export const authRouter = Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  agentId: Joi.string().alphanum().min(1).max(100).optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Register endpoint
authRouter.post('/register', validateRequest({ body: registerSchema }), async (req, res) => {
  try {
    const { username, email, password, agentId } = req.body;

    // TODO: Check if user already exists in database
    // const existingUser = await getUserByUsername(username);
    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Username already exists',
    //     timestamp: new Date().toISOString()
    //   } as APIResponse);
    // }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // TODO: Create user in database
    // const user = await createUser({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   agentId,
    //   role: 'agent',
    //   createdAt: new Date()
    // });

    // Mock user for now
    const user = {
      id: 'mock-user-id',
      username,
      email,
      role: 'agent',
      agentId,
      createdAt: new Date()
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        agentId: user.agentId
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          agentId: user.agentId
        },
        token
      },
      timestamp: new Date().toISOString()
    } as APIResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});

// Login endpoint
authRouter.post('/login', validateRequest({ body: loginSchema }), async (req, res) => {
  try {
    const { username, password } = req.body;

    // TODO: Get user from database
    // const user = await getUserByUsername(username);
    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Invalid credentials',
    //     timestamp: new Date().toISOString()
    //   } as APIResponse);
    // }

    // Mock user for now
    const user = {
      id: 'mock-user-id',
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12), // Mock hashed password
      role: 'agent',
      agentId: 'test-agent-1'
    };

    // Check if username matches (mock check)
    if (username !== user.username) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        agentId: user.agentId
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          agentId: user.agentId
        },
        token
      },
      timestamp: new Date().toISOString()
    } as APIResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});

// Get current user endpoint
authRouter.get('/me', async (req, res) => {
  // This endpoint would be protected by authMiddleware in the main app
  try {
    // TODO: Get user details from database using req.user.id
    
    res.json({
      success: true,
      data: {
        user: {
          id: 'mock-user-id',
          username: 'testuser',
          email: 'test@example.com',
          role: 'agent',
          agentId: 'test-agent-1'
        }
      },
      timestamp: new Date().toISOString()
    } as APIResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user information',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
});
