# Piksi — 2-Player Online Pixies Card Game

## Quick Reference

| What | Command |
|------|---------|
| Dev backend | `cd backend && npm run dev` |
| Dev frontend | `cd frontend && npm run dev` |
| Run tests | `npm test` (from root) |
| Build frontend | `cd frontend && npm run build` |
| Self-host | `docker compose -f compose.selfhost.yml up --build -d` |

## Architecture

```
shared/          TypeScript game engine (pure logic, no I/O)
backend/         Fastify + WebSocket server (imports shared/)
frontend/        Vite + React + Tailwind PWA (imports shared/ for scoring display)
```

- **Backend**: Node.js, Fastify, @fastify/websocket, tsx (runs TS directly)
- **Frontend**: React, Zustand, Tailwind, Pixelify Sans font
- **Self-hosting**: Use `compose.selfhost.yml` with your own HTTPS reverse proxy or tunnel and WebSocket forwarding. The maintainer may keep an ignored `sync.sh` and `docker-compose.yml` locally; never deploy automatically.
- **Game rules**: Use the in-app **How to play** guide. Optional maintainer reference copies live in ignored `private/`; they are not distributed with the repository.

## Conventions

- Game logic lives in `shared/` — both server and client import from it
- Server is authoritative — all game actions go through GameEngine on the backend
- WebSocket protocol defined in `shared/protocol.ts` (shared by server and client)
- Frontend uses Zustand store at `frontend/src/store/game-store.ts`
- Tests: Vitest, run from project root with `npm test`
- Maintainer infrastructure belongs in ignored `CLAUDE.local.md`, not public documentation.
