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
- **Deploy**: Docker Compose on `deployment-host` (`/opt/app`), with project-managed Traefik and Let's Encrypt for piksi.quz.ma
- **DNS and TLS**: Cloudflare manages `quz.ma`. Before cutting over `piksi.quz.ma`, ensure the new Traefik origin has a publicly trusted certificate if Cloudflare uses Full (strict); Let's Encrypt HTTP-01 requires port 80 and a reachable challenge path.
- **Game rules**: See PIXIES_OFFICIAL_LLM_GUIDE.md

## Conventions

- Game logic lives in `shared/` — both server and client import from it
- Server is authoritative — all game actions go through GameEngine on the backend
- WebSocket protocol defined in `shared/protocol.ts` (shared by server and client)
- Frontend uses Zustand store at `frontend/src/store/game-store.ts`
- Tests: Vitest, run from project root with `npm test`
- Deployment via `sync.sh` — never auto-deploy
