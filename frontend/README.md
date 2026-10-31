# Piksi frontend

A React, Vite and Zustand client for Piksi, a two-player online Pixies card game. The Fastify WebSocket server is authoritative; shared game logic supplies the live round score preview and final breakdown.

## Development

From the repository root, run the backend with `cd backend && npm run dev` and the frontend with `cd frontend && npm run dev`. Vite proxies `/ws` to port 3000 by default; set `VITE_WS_TARGET` to change the WebSocket target. Run `npm run build` and `npm run lint` in `frontend`, and `npm test` at the repository root.

Create a room and share its invite link or four-letter code. A session token is stored in the current tab's `sessionStorage`, allowing that seat to resume after a reload or connection loss within the server's two-minute grace period. Use a separate browser context for the other player.

At the final score screen, each player can request a rematch. Scores stay visible until both agree; pending requests survive a reconnect during the grace period.

## Visual system

The Twilight Arcane interface uses a portrait or landscape forest background, violet glass panels, storybook card illustrations and Outfit for UI copy. Pixelify Sans is used only for the wordmark and card numerals. Suit colors and the lavender state highlight are CSS tokens in `src/index.css`. Runtime artwork and icon paths are documented in `../docs/asset-guide.md`; the web app manifest is `public/manifest.webmanifest`.

The play screen fits both boards and the shared display on small screens, with the boards side by side on desktop. The in-app rules explain placement and scoring; status, valid targets, card labels, round previews and the scoring breakdown guide play. Reduced-motion preferences suppress interface animation.
