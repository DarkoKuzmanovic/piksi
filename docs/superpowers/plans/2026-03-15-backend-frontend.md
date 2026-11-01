# Piksi Backend + Frontend Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Build a playable 2-player online Pixies game with WebSocket multiplayer, mobile-first 8-bit UI, and VPS deployment.

**Architecture:** Fastify serves both the WebSocket API and the static frontend build. Rooms are managed in-memory. The shared game engine handles all logic server-side. Frontend is a React PWA with Zustand for state management.

**Tech Stack:** Fastify + @fastify/websocket + @fastify/static (backend), Vite + React + Tailwind + vite-plugin-pwa (frontend)

---

## Backend Tasks

### Task B1: Backend Setup + Server

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/server.ts`

Server setup with Fastify, @fastify/websocket, @fastify/static. Serves frontend from `../frontend/dist/`. WebSocket endpoint at `/ws`.

### Task B2: Room Manager + WebSocket Protocol

**Files:**
- Create: `backend/src/rooms/room-manager.ts`
- Create: `backend/src/ws/handler.ts`
- Create: `backend/src/ws/protocol.ts`

Room lifecycle: create (generate 4-letter code), join, reconnect, cleanup (30 min TTL). WebSocket message protocol:

Client -> Server:
- `create_room { playerName }`
- `join_room { roomCode, playerName }`
- `choose_card { cardTypeId }`
- `choose_keep { keepNew }`
- `choose_space { targetSpace }`
- `next_round`
- `play_again`

Server -> Client:
- `room_created { roomCode, playerId }`
- `room_joined { playerId }`
- `player_joined { playerName }`
- `game_state { state }` (filtered — no deck, opponent facedowns hidden)
- `error { message }`
- `game_started`

State filtering: hide deck, hide opponent's facedown card identities, include own full board.

### Task B3: AI Opponent (Easy mode)

**Files:**
- Create: `backend/src/ai/ai-player.ts`

Easy AI: random legal moves. Runs as a virtual player in the room — server makes moves on its behalf with a short delay.

---

## Frontend Tasks

### Task F1: Frontend Scaffolding

**Files:**
- Create: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.js`, `frontend/postcss.config.js`
- Create: `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
- Create: `frontend/src/index.css` (Tailwind + Pixelify Sans + 8-bit theme)

Vite + React + Tailwind + PWA setup. Pixelify Sans font via Google Fonts. Dark retro color scheme.

### Task F2: WebSocket Hook + Game Store

**Files:**
- Create: `frontend/src/hooks/useWebSocket.ts`
- Create: `frontend/src/store/game-store.ts`
- Create: `frontend/src/lib/types.ts`

Zustand store synced from WebSocket `game_state` messages. Auto-reconnect on disconnect. Store tracks: connection status, room code, player ID, game state, whose turn it is.

### Task F3: Lobby Screen

**Files:**
- Create: `frontend/src/components/Lobby.tsx`

Mobile-first lobby: game title, "Create Game" button, "Join Game" with code input, "Play vs AI" button. Shows room code + QR code after creating. Waiting state for opponent.

### Task F4: Game Board UI

**Files:**
- Create: `frontend/src/components/GameBoard.tsx`
- Create: `frontend/src/components/PlayerGrid.tsx`
- Create: `frontend/src/components/Card.tsx`
- Create: `frontend/src/components/Display.tsx`
- Create: `frontend/src/components/ScoreBreakdown.tsx`
- Create: `frontend/src/components/GameOver.tsx`

Mobile layout: own grid bottom (large), opponent grid top (small), display cards middle. Tap to select cards. Case 2/3 choice modals. Round scoring slide-up. Game over with trophy.

---

## Deployment Tasks

### Task D1: Docker + Deployment

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `sync.sh`
- Create: `CLAUDE.md`

Multi-stage Docker build: build frontend, then run backend serving static files. Use compose.selfhost.yml with your own HTTPS proxy or tunnel and forward WebSocket upgrades.
