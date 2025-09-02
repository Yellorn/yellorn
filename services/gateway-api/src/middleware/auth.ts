import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APIResponse } from '@yellorn/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    agentId?: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      agentId: decoded.agentId
    };

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid token.',
      timestamp: new Date().toISOString()
    } as APIResponse);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.',
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    next();
  };
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        agentId: decoded.agentId
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
