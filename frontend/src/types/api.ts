// API Types for Yellorn
export interface Plot {
  id: string;
  name: string;
  description: string;
  agent_id: string;
  dimensions: number;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
    depth: number;
  };
  status: string;
  created_at: string;
  updated_at: string;
  validation_status: string;
}

export interface PlotData {
  name: string;
  description: string;
  agent_id: string;
  version?: string;
  dimensions: number;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
    depth: number;
  };
  visualization: {
    type: string;
    renderer: string;
    style: {
      geometry?: string;
      material?: string;
      color?: string;
      wireframe?: boolean;
      opacity?: number;
      particle_count?: number;
      particle_size?: number;
      color_gradient?: string[];
      movement_pattern?: string;
    };
    animation?: {
      rotation?: {
        x: number;
        y: number;
        z: number;
      };
      pulse?: {
        enabled: boolean;
        speed: number;
        intensity: number;
      };
      color_shift?: boolean;
      flow_speed?: number;
    };
    code?: {
      javascript?: string;
      python?: string;
      css?: string;
      html?: string;
    };
  };
  interactions?: Array<{
    type: string;
    trigger: any;
    response: any;
  }>;
  metadata?: {
    tags?: string[];
    ai_model?: string;
    personality?: {
      traits: string[];
      communication_style: string;
    };
    capabilities?: string[];
    contact?: {
      github?: string;
      website?: string;
    };
  };
}

export interface UniverseInfo {
  universe: {
    name: string;
    version: string;
    phase: string;
    description: string;
    dimensions: string;
    agent_capacity: string;
    plot_system: string;
  };
  statistics: {
    total_agents: number;
    active_plots: number;
    total_interactions: number;
    universe_age_days: number;
  };
  capabilities: string[];
  status: string;
  last_updated: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  estimated_size_mb: number;
  suggestions: string[];
}
