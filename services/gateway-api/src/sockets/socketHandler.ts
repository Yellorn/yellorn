import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { Message, MessageType } from '@yellorn/types';
import { v4 as uuidv4 } from 'uuid';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    role: string;
    agentId?: string;
  };
}

export const socketHandler = (io: SocketIOServer, logger: winston.Logger) => {
  // Authentication middleware for sockets
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      socket.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        agentId: decoded.agentId
      };

      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`Agent connected: ${socket.user?.agentId || socket.user?.username} (${socket.id})`);

    // Join agent to their personal room
    if (socket.user?.agentId) {
      socket.join(`agent:${socket.user.agentId}`);
      socket.join('universe:genesis'); // Join default shard
    }

    // Handle agent joining universe
    socket.on('agent:join', async (data: { shardId?: string }) => {
      try {
        const shardId = data.shardId || 'genesis';
        
        if (socket.user?.agentId) {
          // Leave previous shard rooms
          const rooms = Array.from(socket.rooms);
          rooms.forEach(room => {
            if (room.startsWith('universe:')) {
              socket.leave(room);
            }
          });

          // Join new shard
          socket.join(`universe:${shardId}`);

          // Broadcast agent join event
          const message: Message = {
            id: uuidv4(),
            type: 'agent_join' as MessageType,
            senderId: socket.user.agentId,
            timestamp: new Date().toISOString(),
            data: {
              agentId: socket.user.agentId,
              username: socket.user.username,
              position: data.position || { x: 0, y: 0, z: 0 }
            },
            shardId
          };

          socket.to(`universe:${shardId}`).emit('universe:event', message);
          logger.info(`Agent ${socket.user.agentId} joined shard ${shardId}`);
        }
      } catch (error) {
        logger.error('Error handling agent join:', error);
        socket.emit('error', { message: 'Failed to join universe' });
      }
    });

    // Handle agent movement
    socket.on('agent:move', (data: { position: any; rotation: any; velocity: any }) => {
      try {
        if (socket.user?.agentId) {
          const message: Message = {
            id: uuidv4(),
            type: 'agent_move' as MessageType,
            senderId: socket.user.agentId,
            timestamp: new Date().toISOString(),
            data: {
              agentId: socket.user.agentId,
              position: data.position,
              rotation: data.rotation,
              velocity: data.velocity
            },
            shardId: 'genesis' // TODO: Get from agent's current shard
          };

          // Broadcast to other agents in the same shard
          socket.to('universe:genesis').emit('universe:event', message);
        }
      } catch (error) {
        logger.error('Error handling agent movement:', error);
      }
    });

    // Handle agent interaction
    socket.on('agent:interact', (data: { targetId: string; interactionType: string; data?: any }) => {
      try {
        if (socket.user?.agentId) {
          const message: Message = {
            id: uuidv4(),
            type: 'agent_interact' as MessageType,
            senderId: socket.user.agentId,
            recipientId: data.targetId,
            timestamp: new Date().toISOString(),
            data: {
              agentId: socket.user.agentId,
              targetId: data.targetId,
              interactionType: data.interactionType,
              interactionData: data.data
            },
            shardId: 'genesis'
          };

          // Send to specific target agent
          socket.to(`agent:${data.targetId}`).emit('universe:event', message);
          
          // Also broadcast to shard if it's a public interaction
          if (data.interactionType === 'public') {
            socket.to('universe:genesis').emit('universe:event', message);
          }

          logger.info(`Agent ${socket.user.agentId} interacted with ${data.targetId}`);
        }
      } catch (error) {
        logger.error('Error handling agent interaction:', error);
      }
    });

    // Handle agent communication
    socket.on('agent:communicate', (data: { message: string; recipientId?: string; broadcast?: boolean }) => {
      try {
        if (socket.user?.agentId) {
          const message: Message = {
            id: uuidv4(),
            type: 'agent_communicate' as MessageType,
            senderId: socket.user.agentId,
            recipientId: data.recipientId,
            timestamp: new Date().toISOString(),
            data: {
              agentId: socket.user.agentId,
              message: data.message,
              broadcast: data.broadcast || false
            },
            shardId: 'genesis'
          };

          if (data.recipientId) {
            // Direct message to specific agent
            socket.to(`agent:${data.recipientId}`).emit('universe:event', message);
          } else if (data.broadcast) {
            // Broadcast to all agents in shard
            socket.to('universe:genesis').emit('universe:event', message);
          }

          logger.info(`Agent ${socket.user.agentId} sent message`);
        }
      } catch (error) {
        logger.error('Error handling agent communication:', error);
      }
    });

    // Handle universe state request
    socket.on('universe:get_state', (callback) => {
      try {
        // TODO: Get actual universe state from State Sync service
        const mockState = {
          shardId: 'genesis',
          timestamp: new Date().toISOString(),
          agents: [
            {
              id: socket.user?.agentId || 'unknown',
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              velocity: { x: 0, y: 0, z: 0 },
              isActive: true,
              lastUpdate: new Date().toISOString(),
              health: 100,
              energy: 100
            }
          ],
          environment: {},
          events: []
        };

        if (callback) {
          callback(mockState);
        }
      } catch (error) {
        logger.error('Error getting universe state:', error);
        if (callback) {
          callback({ error: 'Failed to get universe state' });
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`Agent disconnected: ${socket.user?.agentId || socket.user?.username} (${socket.id}) - ${reason}`);

      if (socket.user?.agentId) {
        // Broadcast agent leave event
        const message: Message = {
          id: uuidv4(),
          type: 'agent_leave' as MessageType,
          senderId: socket.user.agentId,
          timestamp: new Date().toISOString(),
          data: {
            agentId: socket.user.agentId,
            reason
          },
          shardId: 'genesis'
        };

        socket.to('universe:genesis').emit('universe:event', message);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  logger.info('Socket.IO server initialized with authentication');
};
