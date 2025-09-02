import winston from 'winston';
import { EventEmitter } from 'events';
import { AgentState, UniverseState, Message, Vector3 } from '@yellorn/types';
import * as CANNON from 'cannon-es';

export class UniverseEngine extends EventEmitter {
  private isActive: boolean = false;
  private lastUpdate: Date = new Date();
  private updateInterval?: NodeJS.Timeout;
  private agents: Map<string, AgentState> = new Map();
  private physicsWorld: CANNON.World;
  private readonly TICK_RATE = 60; // 60 FPS
  private readonly TICK_INTERVAL = 1000 / this.TICK_RATE;

  constructor(private logger: winston.Logger) {
    super();
    this.setupPhysicsWorld();
  }

  private setupPhysicsWorld(): void {
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0), // Earth-like gravity
    });

    // Set up physics materials and contact materials
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.4,
        restitution: 0.3,
      }
    );
    this.physicsWorld.addContactMaterial(defaultContactMaterial);
    this.physicsWorld.defaultContactMaterial = defaultContactMaterial;

    // Add ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.physicsWorld.addBody(groundBody);

    this.logger.info('Physics world initialized with gravity and ground plane');
  }

  public start(): void {
    if (this.isActive) {
      this.logger.warn('Universe Engine is already running');
      return;
    }

    this.isActive = true;
    this.lastUpdate = new Date();

    // Start the main update loop
    this.updateInterval = setInterval(() => {
      this.update();
    }, this.TICK_INTERVAL);

    this.logger.info(`Universe Engine started with ${this.TICK_RATE} FPS tick rate`);
    this.emit('engine:started');
  }

  public async stop(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }

    this.logger.info('Universe Engine stopped');
    this.emit('engine:stopped');
  }

  private update(): void {
    const deltaTime = this.TICK_INTERVAL / 1000; // Convert to seconds
    
    try {
      // Update physics simulation
      this.physicsWorld.step(deltaTime);

      // Update agent states
      this.updateAgents(deltaTime);

      // Update timestamp
      this.lastUpdate = new Date();

      // Emit update event for real-time synchronization
      this.emit('universe:update', this.getUniverseState());

    } catch (error) {
      this.logger.error('Error in universe update loop:', error);
    }
  }

  private updateAgents(deltaTime: number): void {
    for (const [agentId, agent] of this.agents) {
      // Update agent physics if they have a physics body
      const physicsBody = this.getAgentPhysicsBody(agentId);
      if (physicsBody) {
        // Sync physics body position with agent state
        agent.position = {
          x: physicsBody.position.x,
          y: physicsBody.position.y,
          z: physicsBody.position.z
        };

        agent.velocity = {
          x: physicsBody.velocity.x,
          y: physicsBody.velocity.y,
          z: physicsBody.velocity.z
        };
      }

      // Update agent last update timestamp
      agent.lastUpdate = new Date().toISOString();

      // Emit agent update event
      this.emit('agent:update', agentId, agent);
    }
  }

  public addAgent(agentId: string, initialState: Partial<AgentState>): boolean {
    if (this.agents.has(agentId)) {
      this.logger.warn(`Agent ${agentId} already exists in universe`);
      return false;
    }

    const agentState: AgentState = {
      id: agentId,
      position: initialState.position || { x: 0, y: 1, z: 0 },
      rotation: initialState.rotation || { x: 0, y: 0, z: 0 },
      velocity: initialState.velocity || { x: 0, y: 0, z: 0 },
      isActive: true,
      lastUpdate: new Date().toISOString(),
      health: initialState.health || 100,
      energy: initialState.energy || 100
    };

    this.agents.set(agentId, agentState);

    // Create physics body for agent
    this.createAgentPhysicsBody(agentId, agentState);

    this.logger.info(`Agent ${agentId} added to universe at position (${agentState.position.x}, ${agentState.position.y}, ${agentState.position.z})`);
    this.emit('agent:added', agentId, agentState);

    return true;
  }

  public removeAgent(agentId: string): boolean {
    if (!this.agents.has(agentId)) {
      return false;
    }

    // Remove physics body
    this.removeAgentPhysicsBody(agentId);

    // Remove from agents map
    this.agents.delete(agentId);

    this.logger.info(`Agent ${agentId} removed from universe`);
    this.emit('agent:removed', agentId);

    return true;
  }

  public updateAgentPosition(agentId: string, position: Vector3, rotation?: Vector3): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    agent.position = position;
    if (rotation) {
      agent.rotation = rotation;
    }
    agent.lastUpdate = new Date().toISOString();

    // Update physics body position
    const physicsBody = this.getAgentPhysicsBody(agentId);
    if (physicsBody) {
      physicsBody.position.set(position.x, position.y, position.z);
      if (rotation) {
        physicsBody.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
      }
    }

    this.emit('agent:moved', agentId, position, rotation);
    return true;
  }

  public applyForceToAgent(agentId: string, force: Vector3): boolean {
    const physicsBody = this.getAgentPhysicsBody(agentId);
    if (!physicsBody) {
      return false;
    }

    physicsBody.applyImpulse(new CANNON.Vec3(force.x, force.y, force.z));
    return true;
  }

  private createAgentPhysicsBody(agentId: string, agentState: AgentState): void {
    // Create a sphere body for the agent
    const shape = new CANNON.Sphere(0.5); // 0.5 meter radius
    const body = new CANNON.Body({ 
      mass: 1,
      shape,
      position: new CANNON.Vec3(
        agentState.position.x,
        agentState.position.y,
        agentState.position.z
      )
    });

    body.userData = { agentId };
    this.physicsWorld.addBody(body);
  }

  private removeAgentPhysicsBody(agentId: string): void {
    const body = this.getAgentPhysicsBody(agentId);
    if (body) {
      this.physicsWorld.removeBody(body);
    }
  }

  private getAgentPhysicsBody(agentId: string): CANNON.Body | null {
    for (const body of this.physicsWorld.bodies) {
      if (body.userData?.agentId === agentId) {
        return body;
      }
    }
    return null;
  }

  public getAgent(agentId: string): AgentState | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): AgentState[] {
    return Array.from(this.agents.values());
  }

  public getActiveAgentCount(): number {
    return Array.from(this.agents.values()).filter(agent => agent.isActive).length;
  }

  public getUniverseState(): UniverseState {
    return {
      shardId: 'genesis',
      timestamp: this.lastUpdate.toISOString(),
      agents: this.getAllAgents(),
      environment: {
        gravity: { x: 0, y: -9.82, z: 0 },
        bounds: {
          min: { x: -1000, y: -100, z: -1000 },
          max: { x: 1000, y: 1000, z: 1000 }
        }
      },
      events: [] // Events would be managed separately
    };
  }

  public getLastUpdateTime(): string {
    return this.lastUpdate.toISOString();
  }

  public isRunning(): boolean {
    return this.isActive;
  }

  public getPhysicsWorld(): CANNON.World {
    return this.physicsWorld;
  }
}
