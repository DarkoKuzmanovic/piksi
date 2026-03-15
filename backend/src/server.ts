import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { RoomManager } from './room-manager.js';
import { handleMessage } from './ws-handler.js';
import type { ClientMessage } from './protocol.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = Fastify({ logger: true });
const roomManager = new RoomManager();

await server.register(cors);
await server.register(websocket);

// Serve frontend static files (warns if frontend/dist doesn't exist yet)
const frontendDist = path.join(__dirname, '../../frontend/dist');
await server.register(fastifyStatic, {
  root: frontendDist,
  prefix: '/',
  wildcard: false,
});

// WebSocket endpoint
server.get('/ws', { websocket: true }, (socket, _req) => {
  socket.on('message', (raw) => {
    try {
      const message: ClientMessage = JSON.parse(raw.toString());
      handleMessage(socket, message, roomManager);
    } catch {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
    }
  });

  socket.on('close', () => {
    roomManager.handleDisconnect(socket);
  });
});

// SPA fallback for client-side routing
server.setNotFoundHandler((_req, reply) => {
  return reply.sendFile('index.html');
});

// Cleanup stale rooms every 5 minutes
setInterval(() => roomManager.cleanupStaleRooms(), 5 * 60 * 1000);

const port = parseInt(process.env.PORT || '3000');
await server.listen({ port, host: '0.0.0.0' });
