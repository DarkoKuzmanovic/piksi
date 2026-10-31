# Piksi — 2-Player Online Pixies Card Game

## Quick Reference

| What | Command |
|------|---------|
| Dev backend | `cd backend && npm run dev` |
| Dev frontend | `cd frontend && npm run dev` |
| Run tests | `npm test` (from root) |
| Build frontend | `cd frontend && npm run build` |
| Deploy to VPS | `./sync.sh` |

## Architecture

```
shared/          TypeScript game engine (pure logic, no I/O)
backend/         Fastify + WebSocket server (imports shared/)
frontend/        Vite + React + Tailwind PWA (imports shared/ for scoring display)
```

- **Backend**: Node.js, Fastify, @fastify/websocket, tsx (runs TS directly)
- **Frontend**: React, Zustand, Tailwind, Pixelify Sans font
- **Deploy**: Docker Compose on `deployment-host` (`/opt/app`); the app joins `application-network` as `piksi` for the existing `application-tunnel` Cloudflare Tunnel.
- **DNS and TLS**: Cloudflare routes `piksi.quz.ma` through the `application-tunnel` tunnel to `http://piksi:3000`; its proxied CNAME points to `tunnel.example.com`.
- **Game rules**: See PIXIES_OFFICIAL_LLM_GUIDE.md

## Conventions

- Game logic lives in `shared/` — both server and client import from it
- Server is authoritative — all game actions go through GameEngine on the backend
- WebSocket protocol defined in `shared/protocol.ts` (shared by server and client)
- Frontend uses Zustand store at `frontend/src/store/game-store.ts`
- Tests: Vitest, run from project root with `npm test`
- Deployment via `sync.sh` — never auto-deploy
