# Piksi frontend

A React, Vite and Zustand client for Piksi, a two-player online woodland animal card game. The Fastify WebSocket server is authoritative; shared game logic supplies the live round score preview and final breakdown.

## Development

From the repository root, run the backend with `cd backend && npm run dev` and the frontend with `cd frontend && npm run dev`. Vite proxies `/ws` to port 3000 by default; set `VITE_WS_TARGET` to change the WebSocket target. Run `npm run build` and `npm run lint` in `frontend`, and `npm test` at the repository root.

Create a room and share its invite link or four-letter code. A session token is stored in the current tab's `sessionStorage`, allowing that seat to resume after a reload or connection loss within the server's two-minute grace period. Use a separate browser context for the other player.

At the final score screen, each player can request a rematch. Scores stay visible until both agree; pending requests survive a reconnect during the grace period.

## Visual system

The cozy woodland visual system implements the accepted sketch in `../docs/design/piksi-woodland.pen` and its mobile/desktop exports in `../docs/design/exports/`. Wooden panels, hard pixel bevels, parchment reading wells and original animal sprites replace the previous theme. `src/index.css` is the single source for color, typography, geometry and component styling; runtime artwork and production details are documented in `../docs/asset-guide.md` and `public/assets/MANIFEST.md`.

Pixelify Sans is used for prose/UI. Press Start 2P (Google Fonts, SIL OFL 1.1) sets card/slot numerals, scoring counts, scores/previews/totals, R1–R3, round/turn/pick numbers and room codes: weight 400 only, 16/24/32 px only. Mixed metadata keeps Pixelify words with 16 px numeral spans; metadata, score pills and round previews share a baseline, with a 2 px optical correction for Press Start 2P's raised digit ink at 16 px. Numbers inside running rules prose remain Pixelify. No synthetic bold or condensed numerals.

Animals follow card number (mouse, frog, hedgehog, squirrel, rabbit, badger, fox, owl, stag), never suit. Four earthy suit colors have redundant pattern bands and printed names; multicolor has four hard segments. Ivory action brackets/validation checks are not suit colors, and purple is keyboard focus only. All pixel artwork uses `image-rendering: pixelated`.

Mobile preserves opponent → gathering → own-board order with 55×77 opponent cards and 60×84 own/display cards. Desktop uses three columns and 120×168 board cards. Shorter viewports, long names and text zoom use natural page/dialog scrolling, not clipped shells or smaller numerals. Dialog focus traps, labels, connection/error feedback and rematch behavior are retained. Reduced-motion preferences disable press transitions; there is no continuous particle layer. The shared engine, protocol and server authority are unchanged.
