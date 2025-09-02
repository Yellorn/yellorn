import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { APIResponse } from '@yellorn/types';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: { validationErrors },
        timestamp: new Date().toISOString()
      } as APIResponse);
    }

    next();
  };
};

export const validateBodyConfiguration = (req: Request, res: Response, next: NextFunction) => {
  const bodySchema = Joi.object({
    id: Joi.string().alphanum().min(1).max(100).required(),
    name: Joi.string().min(1).max(100).required(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
    metadata: Joi.object({
      author: Joi.string().min(1).max(100).required(),
      created: Joi.string().isoDate().required(),
      updated: Joi.string().isoDate().optional(),
      description: Joi.string().max(1000).optional(),
      tags: Joi.array().items(Joi.string()).max(20).optional(),
      version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required()
    }).required(),
    embodiment: Joi.object({
      type: Joi.string().required(),
      dimensions: Joi.number().integer().min(2).max(4).default(3),
      appearance: Joi.object({
        type: Joi.string().valid('3d-model', '2d-sprite', 'particle-system', 'procedural', 'custom').required(),
        model: Joi.string().optional(),
        textures: Joi.array().items(Joi.string()).max(10).optional(),
        materials: Joi.object().optional(),
        animations: Joi.object().optional(),
        scale: Joi.object({
          x: Joi.number().default(1),
          y: Joi.number().default(1),
          z: Joi.number().default(1)
        }).default({ x: 1, y: 1, z: 1 }),
        color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
      }).required(),
      physics: Joi.object({
        mass: Joi.number().min(0.1).max(1000).default(1.0),
        friction: Joi.number().min(0).max(1).default(0.5),
        restitution: Joi.number().min(0).max(1).default(0.3),
        collisions: Joi.boolean().default(true),
        gravity: Joi.boolean().default(true)
      }).required(),
      initialPosition: Joi.object({
        x: Joi.number(),
        y: Joi.number(),
        z: Joi.number()
      }).optional(),
      initialRotation: Joi.object({
        x: Joi.number(),
        y: Joi.number(),
        z: Joi.number()
      }).optional()
    }).required(),
    behaviors: Joi.object({
      movement: Joi.object({
        type: Joi.string().valid('static', 'kinematic', 'dynamic', 'ai-controlled').required(),
        maxSpeed: Joi.number().min(0).max(100).default(5),
        acceleration: Joi.number().min(0).max(50).default(10),
        rotationSpeed: Joi.number().min(0).max(10).default(2),
        pathfinding: Joi.boolean().default(false)
      }).required(),
      interaction: Joi.object({
        canCommunicate: Joi.boolean().default(true),
        communicationRange: Joi.number().min(0).max(1000).default(100),
        canModifyEnvironment: Joi.boolean().default(false),
        canInteractWithObjects: Joi.boolean().default(true),
        friendlyToOthers: Joi.boolean().default(true)
      }).required(),
      custom: Joi.object().optional()
    }).required(),
    permissions: Joi.object({
      canModifyEnvironment: Joi.boolean().default(false),
      canInteractWithOthers: Joi.boolean().default(true),
      canAccessExternalAPIs: Joi.boolean().default(false),
      maxResourceUsage: Joi.object({
        maxCpuUsage: Joi.number().min(0).max(100).default(10),
        maxMemoryUsage: Joi.number().min(0).max(1024).default(100),
        maxNetworkRequests: Joi.number().min(0).max(1000).default(100),
        maxFileSize: Joi.number().min(0).max(10).default(1)
      }).required(),
      trustedLevel: Joi.string().valid('untrusted', 'community', 'verified', 'core').default('untrusted')
    }).required(),
    customData: Joi.object().optional()
  });

  return validateRequest({ body: bodySchema })(req, res, next);
};

export const requestValidator = {
  validateRequest,
  validateBodyConfiguration
};
