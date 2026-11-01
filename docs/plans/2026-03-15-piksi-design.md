# Piksi — 2-Player Online Pixies Card Game

> 8-bit aesthetic, mobile-first PWA, self-hosted on VPS

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React + Tailwind + vite-plugin-pwa |
| Backend | Node.js + Fastify + `ws` (WebSocket) |
| Game engine | Shared TypeScript (server-authoritative) |
| State (client) | Zustand |
| 8-bit aesthetic | Pixelify Sans font, pixel art sprites, retro palette |
| Deploy | Docker Compose with a user-configured HTTPS reverse proxy or tunnel |
| Domain | `piksi.quz.ma` |

## Project Structure

```
piksi/
├── frontend/              Vite + React SPA (PWA)
│   ├── src/
│   │   ├── components/    Game board, cards, display, scoreboard
│   │   ├── hooks/         useWebSocket, useGameState
│   │   ├── store/         Zustand store (synced from server)
│   │   └── assets/        Pixel art sprites, sounds
│   └── index.html
├── backend/               Node.js + Fastify
│   ├── src/
│   │   ├── engine/        Game logic (placement, scoring, round flow)
│   │   ├── rooms/         WebSocket room management
│   │   └── ai/            AI opponent (easy/medium/hard)
│   └── server.ts
├── shared/                Shared TypeScript types + constants
│   ├── types.ts           CardType, MatchState, GamePhase
│   ├── deck.ts            70-card manifest + helpers
│   └── scoring.ts         Scoring logic (used by both server & client)
├── compose.selfhost.yml   Generic loopback-only container deployment
└── Dockerfile             Multi-stage frontend + backend image
```

## Visual Design

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Blue | `#3B82F6` | Cards, zone highlights |
| Green | `#22C55E` | Cards, zone highlights |
| Yellow | `#EAB308` | Cards, zone highlights |
| Red | `#EF4444` | Cards, zone highlights |
| Multicolor | Rainbow gradient/shimmer | Distinct from single colors |
| BG Dark | `#1a1a2e` | App background |
| BG Card | `#16213e` | Card backs, panels |
| Text | `#e0e0e0` | Primary text |

### Card Art

- Pixel art pixie creature per color (4 sprites + 1 multicolor variant)
- Card number large and centered, pixelated
- Spirals: small pixel spiral icons
- Crosses: small pixel X icons
- Special cards: subtle glow/shimmer border
- Card back: generic pixel pattern (facedown)

### Grid

- 3x3 board with chunky pixel borders
- Empty spaces show the number faintly
- Facedown cards show card back sprite
- Validated spaces get subtle pixel glow

### Typography

Pixelify Sans — all text (numbers, scores, UI labels). Readable on mobile, retro feel.

## Multiplayer Flow

### Room System

1. Open `piksi.quz.ma` -> lobby screen
2. "Create Game" -> generates 4-letter room code (e.g. `AXKM`)
3. Share code (or QR code) with opponent
4. Opponent opens site, taps "Join Game", enters code
5. Both connected -> game starts

No accounts, no login. Room codes only.

### WebSocket Protocol

```
Client -> Server:  JOIN {roomCode, playerName}
Server -> Client:  GAME_STATE (full snapshot)
Client -> Server:  ACTION {type: 'choose_card' | 'choose_keep' | 'choose_space', payload}
Server validates -> broadcasts GAME_STATE to both clients
```

### Reconnection

Reconnect with same room code + player name restores session. Server holds state in memory ~30 minutes.

### AI Opponent

"Play vs AI" button in lobby. Server plays second seat. Difficulty: Easy / Medium / Hard.

## Mobile UI Layout

### During Play

- Player's board: bottom of screen (thumb-reachable)
- Opponent's board: smaller, top of screen
- Display cards: middle area, tap to pick
- Scores: corners
- Turn indicator: subtle pixel animation

### Card Placement

- Tap display card to select
- Case 1 (auto): card animates to space with pixel "pop"
- Case 2 (choose faceup): both cards side-by-side, tap to pick
- Case 3 (facedown): empty spaces pulse, tap one

### Round End

- 8-bit fanfare
- Score breakdown slides up (validated + spirals - crosses + zone)
- Both players see each other's breakdown
- "Next Round" to continue

### Game Over

- Final scores side-by-side across 3 rounds
- Winner: pixel trophy animation
- Tie: both get trophies
- "Play Again" -> same room, new game

## Sounds (Stretch Goal)

8-bit chiptune SFX: card place, validation, round end, game over fanfare.

## Game Rules Reference

All game logic per `PIXIES_OFFICIAL_LLM_GUIDE.md`:
- 70-card deck, 3 rounds, 3x3 grid per player
- 4-pick turns with alternating first player
- 3 placement cases (auto, choose faceup, facedown on empty)
- Scoring: validated numbers + symbols + largest color zone (x2/x3/x4 per round)
- 2-player equalization rule for round end
- Server-authoritative state, hidden facedown identities
