import { z } from 'zod';

// Core Agent Types
export const AgentIdSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
export type AgentId = z.infer<typeof AgentIdSchema>;

export const Vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});
export type Vector3 = z.infer<typeof Vector3Schema>;

export const Vector2Schema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Vector2 = z.infer<typeof Vector2Schema>;

// Body Configuration Schema
export const BodyMetadataSchema = z.object({
  author: z.string().min(1).max(100),
  created: z.string().datetime(),
  updated: z.string().datetime().optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
});

export const PhysicsPropertiesSchema = z.object({
  mass: z.number().min(0.1).max(1000).default(1.0),
  friction: z.number().min(0).max(1).default(0.5),
  restitution: z.number().min(0).max(1).default(0.3),
  collisions: z.boolean().default(true),
  gravity: z.boolean().default(true),
});

export const AppearanceSchema = z.object({
  type: z.enum(['3d-model', '2d-sprite', 'particle-system', 'procedural', 'custom']),
  model: z.string().optional(),
  textures: z.array(z.string()).max(10).optional(),
  materials: z.record(z.any()).optional(),
  animations: z.record(z.any()).optional(),
  scale: Vector3Schema.default({ x: 1, y: 1, z: 1 }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const MovementBehaviorSchema = z.object({
  type: z.enum(['static', 'kinematic', 'dynamic', 'ai-controlled']),
  maxSpeed: z.number().min(0).max(100).default(5),
  acceleration: z.number().min(0).max(50).default(10),
  rotationSpeed: z.number().min(0).max(10).default(2),
  pathfinding: z.boolean().default(false),
});

export const InteractionBehaviorSchema = z.object({
  canCommunicate: z.boolean().default(true),
  communicationRange: z.number().min(0).max(1000).default(100),
  canModifyEnvironment: z.boolean().default(false),
  canInteractWithObjects: z.boolean().default(true),
  friendlyToOthers: z.boolean().default(true),
});

export const BehaviorsSchema = z.object({
  movement: MovementBehaviorSchema,
  interaction: InteractionBehaviorSchema,
  custom: z.record(z.any()).optional(),
});

export const ResourceLimitsSchema = z.object({
  maxCpuUsage: z.number().min(0).max(100).default(10), // percentage
  maxMemoryUsage: z.number().min(0).max(1024).default(100), // MB
  maxNetworkRequests: z.number().min(0).max(1000).default(100), // per minute
  maxFileSize: z.number().min(0).max(10).default(1), // MB
});

export const PermissionsSchema = z.object({
  canModifyEnvironment: z.boolean().default(false),
  canInteractWithOthers: z.boolean().default(true),
  canAccessExternalAPIs: z.boolean().default(false),
  maxResourceUsage: ResourceLimitsSchema,
  trustedLevel: z.enum(['untrusted', 'community', 'verified', 'core']).default('untrusted'),
});

export const EmbodimentSchema = z.object({
  type: z.string(),
  dimensions: z.number().min(2).max(4).default(3),
  appearance: AppearanceSchema,
  physics: PhysicsPropertiesSchema,
  initialPosition: Vector3Schema.optional(),
  initialRotation: Vector3Schema.optional(),
});

export const BodyConfigurationSchema = z.object({
  id: AgentIdSchema,
  name: z.string().min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  metadata: BodyMetadataSchema,
  embodiment: EmbodimentSchema,
  behaviors: BehaviorsSchema,
  permissions: PermissionsSchema,
  customData: z.record(z.any()).optional(),
});

export type BodyMetadata = z.infer<typeof BodyMetadataSchema>;
export type PhysicsProperties = z.infer<typeof PhysicsPropertiesSchema>;
export type Appearance = z.infer<typeof AppearanceSchema>;
export type MovementBehavior = z.infer<typeof MovementBehaviorSchema>;
export type InteractionBehavior = z.infer<typeof InteractionBehaviorSchema>;
export type Behaviors = z.infer<typeof BehaviorsSchema>;
export type ResourceLimits = z.infer<typeof ResourceLimitsSchema>;
export type Permissions = z.infer<typeof PermissionsSchema>;
export type Embodiment = z.infer<typeof EmbodimentSchema>;
export type BodyConfiguration = z.infer<typeof BodyConfigurationSchema>;

// Universe State Types
export const AgentStateSchema = z.object({
  id: AgentIdSchema,
  position: Vector3Schema,
  rotation: Vector3Schema,
  velocity: Vector3Schema,
  isActive: z.boolean(),
  lastUpdate: z.string().datetime(),
  health: z.number().min(0).max(100).default(100),
  energy: z.number().min(0).max(100).default(100),
});

export type AgentState = z.infer<typeof AgentStateSchema>;

export const UniverseStateSchema = z.object({
  shardId: z.string(),
  timestamp: z.string().datetime(),
  agents: z.array(AgentStateSchema),
  environment: z.record(z.any()),
  events: z.array(z.any()),
});

export type UniverseState = z.infer<typeof UniverseStateSchema>;

// Communication Types
export const MessageTypeSchema = z.enum([
  'agent_join',
  'agent_leave',
  'agent_move',
  'agent_interact',
  'agent_communicate',
  'environment_change',
  'system_event',
]);

export const MessageSchema = z.object({
  id: z.string().uuid(),
  type: MessageTypeSchema,
  senderId: AgentIdSchema.optional(),
  recipientId: AgentIdSchema.optional(), // undefined for broadcast
  timestamp: z.string().datetime(),
  data: z.any(),
  shardId: z.string(),
});

export type MessageType = z.infer<typeof MessageTypeSchema>;
export type Message = z.infer<typeof MessageSchema>;

// API Response Types
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime(),
  requestId: z.string().uuid().optional(),
});

export type APIResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
};

// Validation Types
export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  securityIssues: z.array(z.string()),
  performance: z.object({
    estimatedCpuUsage: z.number(),
    estimatedMemoryUsage: z.number(),
    estimatedNetworkUsage: z.number(),
  }),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// Governance Types
export const ProposalTypeSchema = z.enum([
  'body_addition',
  'rule_change',
  'security_update',
  'feature_request',
  'community_decision',
]);

export const ProposalSchema = z.object({
  id: z.string().uuid(),
  type: ProposalTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
  author: z.string(),
  createdAt: z.string().datetime(),
  votingEndsAt: z.string().datetime(),
  status: z.enum(['draft', 'voting', 'approved', 'rejected', 'implemented']),
  votes: z.array(z.object({
    agentId: AgentIdSchema,
    vote: z.enum(['yes', 'no', 'abstain']),
    timestamp: z.string().datetime(),
    reason: z.string().optional(),
  })),
});

export type ProposalType = z.infer<typeof ProposalTypeSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;

// Export all schemas for runtime validation
export const Schemas = {
  AgentId: AgentIdSchema,
  Vector3: Vector3Schema,
  Vector2: Vector2Schema,
  BodyMetadata: BodyMetadataSchema,
  PhysicsProperties: PhysicsPropertiesSchema,
  Appearance: AppearanceSchema,
  MovementBehavior: MovementBehaviorSchema,
  InteractionBehavior: InteractionBehaviorSchema,
  Behaviors: BehaviorsSchema,
  ResourceLimits: ResourceLimitsSchema,
  Permissions: PermissionsSchema,
  Embodiment: EmbodimentSchema,
  BodyConfiguration: BodyConfigurationSchema,
  AgentState: AgentStateSchema,
  UniverseState: UniverseStateSchema,
  MessageType: MessageTypeSchema,
  Message: MessageSchema,
  APIResponse: APIResponseSchema,
  ValidationResult: ValidationResultSchema,
  ProposalType: ProposalTypeSchema,
  Proposal: ProposalSchema,
};
