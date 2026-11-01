# Piksi asset guide

Piksi uses a cozy 8-bit / 16-bit woodland identity: original animal sprites, forest scenery, chunky wooden frames, cream parchment wells and hard pixel shadows. The accepted editable sketch is `docs/design/piksi-woodland.pen`; `docs/design/exports/` contains the mobile, desktop and component visual targets. See `docs/design/README.md` for the board index and `docs/superpowers/specs/2026-11-01-woodland-8bit-design.md` for the contract.

## Runtime artwork

All paths below are relative to `frontend/public/`. Runtime art is copied from `docs/design/assets/`, whose nested `assets/` and `icons/` directories preserve the generation output. `frontend/public/assets/MANIFEST.md` contains the original prompts, processing steps, file sizes and limitations merged from `/tmp/piksi-woodland-art/MANIFEST.md`. Full-resolution sources and generation scripts remain in `/tmp/piksi-woodland-art/`; they are not runtime dependencies.

| Asset | Dimensions | Purpose |
| --- | --- | --- |
| `assets/bg/woodland.webp` | 2560 × 1440 | Landscape woodland scenery |
| `assets/bg/woodland-portrait.webp` | 1080 × 1920 | Phone woodland scenery |
| `assets/brand/logo.webp` | 1024 × 1024 transparent | Fox-and-acorn emblem |
| `assets/cards/back.webp` | 720 × 1008 | Non-identifying 5:7 card back |
| `assets/cards/animal-1.webp` … `animal-9.webp` | 768 × 768 transparent | Number-specific sprites |
| `icons/icon-192.png` | 192 × 192 | Standard app icon |
| `icons/icon-512.png` | 512 × 512 | Standard app icon |
| `icons/icon-maskable-512.png` | 512 × 512 | Maskable app icon |
| `icons/apple-touch-icon.png` | 180 × 180 | Apple home-screen icon |

Animal identity follows number, never suit: **1 field mouse, 2 frog, 3 hedgehog, 4 squirrel, 5 rabbit, 6 badger, 7 red fox, 8 owl, 9 stag**. All supplied sprites have binary alpha and a shared logical pixel grid. Art uses `image-rendering: pixelated`; animal images use `contain`. No old card sprites or old scenic backgrounds remain in runtime assets.

## Visual system and accessibility

`frontend/src/index.css` is the single token and component stylesheet. Forest `#1C2C24`, wood `#D7A66B` / `#A16B3B` / `#51341F`, parchment `#F7E8C6`, ink `#281C15` and honey `#D59B55` define the chrome. Suit colors remain BLUE `#385C83`, GREEN `#5F7945`, YELLOW `#E5BA55`, RED `#B9684B`, with distinct pattern bands and printed suit words. Multicolor uses four hard segments. Ivory `#FFFDF4` selection brackets/checks and purple `#693E91` keyboard focus remain independent of suit.

Pixelify Sans is the prose/UI face. Press Start 2P is used only for numerals/codes, at weight 400 and 16/24/32 px, including card/slot numbers, counts, scores and room codes. Both are loaded through Google Fonts in the stylesheet. Native 1× tests live in `docs/design/exports/Test-Numerals-1x-*.png`; the numeral face separates 5/S, 8/B, 2/Z and 6/G.

Card art and branding are decorative (`alt=""`); card accessible descriptions retain number, suit and scoring information. Backs never reveal hidden identities. Scoring still comes from the shared game engine; animals introduce no rules. Controls retain visible focus, modal focus traps, 44 px minimum targets and reduced-motion behavior. Page/dialog content scrolls rather than shrinking phone numerals or clipping actions. No continuous particles, glow or blur layer is used.
