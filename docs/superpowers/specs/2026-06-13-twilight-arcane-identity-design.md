# Twilight Arcane — Visual Identity Design

**Date:** 2026-06-13
**Status:** Approved (visual direction + technical approach confirmed by user)
**Scope:** Frontend-only. Recolor and restyle Piksi from the current navy+coral "game-jam" look into a cohesive **Twilight Arcane** identity — starlit violet with magenta accents and a fairy/arcane mood.

---

## Goal

Give Piksi a distinct visual identity. Today it uses a generic dark-navy palette with a coral accent that doesn't connect to the "Pixies" theme. This round establishes a single, intentional look — **Twilight Arcane** — across every screen: lobby, board, modals, score reveal, and game-over.

This is a **look-and-feel** pass, not a layout change. Layout, components, and game logic stay as they are. No new hand-drawn art assets — everything is CSS/SVG.

**Out of scope:** hand-drawn pixie illustrations (the existing `docs/asset-guide.md` already specs those for a future round), layout/IA changes, sound, and gameplay.

---

## Design direction

Approved via browser mockup (`board-mockup.html`): the real `GameBoard` layout recolored into violet, with a starfield atmosphere, depth on the cards, frosted violet chrome, and a gradient wordmark.

### Palette

| Token | Old | New | Role |
|-------|-----|-----|------|
| `--color-bg` | `#1a1a2e` | `#140d24` | deep violet-black base |
| `--color-bg-card` | `#16213e` | `#1f1640` | card / panel fill |
| `--color-bg-surface` | `#0f3460` | `#2c1d52` | raised surface |
| `--color-text` | `#e0e0e0` | `#e8e0f5` | soft lavender-white |
| `--color-text-muted` | `#8888aa` | `#9a86c8` | muted lavender |
| `--color-accent` | `#e94560` | `#ff5ca8` | magenta accent |
| `--color-lavender` | _(new)_ | `#c8a8ff` | secondary accent / glow |
| `--color-highlight` | _(new)_ | `#e6d8ff` | bright lavender-white — selected/validated ring |

### Suit colors (tuned to glow on violet, kept mutually distinguishable)

| Token | Old | New | Suit |
|-------|-----|-----|------|
| `--color-blue` | `#3B82F6` | `#6ea8ff` | periwinkle |
| `--color-green` | `#22C55E` | `#5ce6b0` | mint |
| `--color-yellow` | `#EAB308` | `#ffcf5c` | gold |
| `--color-red` | `#EF4444` | `#ff7b9c` | rose |

### Alpha-safe tokens (new)

To keep glows/patterns themeable in one place, add RGB-triplet vars and use them with the `rgb(... / alpha)` syntax inside keyframes and patterns:

```css
--color-accent-rgb: 255 92 168;
--color-lavender-rgb: 200 168 255;
```

Example: `box-shadow: 0 0 12px rgb(var(--color-accent-rgb) / 0.55);` — resolves correctly inside `@keyframes`.

---

## Two deliberate decisions (from advisor review)

1. **Highlight ≠ rose suit.** The accent magenta (`#ff5ca8`) and the rose suit (`#ff7b9c`) are close in hue. The "selectable space / validated card" glow must read as *state*, not as *suit*, so it uses **`--color-highlight`** (bright lavender-white), not the accent. This keeps "this card is highlighted" visually separate from "this card's suit is rose."
2. **Suit legibility.** The four suits must stay mutually distinguishable (value + hue) on the violet background. Note the suit vars double as the **player-name label colors** in `GameBoard` (opponent = red→rose, you = blue→periwinkle); retinting them is intended and fine.

---

## Critical implementation note: color literals live in THREE places

A `:root`-only edit produces a **half-coral UI**. The suit + accent colors are duplicated as hardcoded literals outside `:root`. All three must change together:

1. **`index.css` — `:root` vars** (the easy part).
2. **`index.css` — hardcoded literals** that won't follow the vars:
   - `pulse-glow` / `pulse-border` keyframes → `rgba(233,69,96,…)` (coral) → route through `--color-accent-rgb`.
   - `card-back-pattern` → `rgba(233,69,96,.15)` + `rgba(15,52,96,.3)` → re-author as the arcane violet weave (`--color-lavender-rgb` + `--color-accent-rgb`).
   - `.border-multicolor` → `linear-gradient(135deg,#3B82F6,#22C55E,#EAB308,#EF4444)` → use the suit vars.
   - `lobby-spinner` → `rgba(233,69,96,.3)` → route through `--color-accent-rgb`.
3. **`Card.tsx` — `COLOR_MAP`** (lines 4–7): the four suit hexes the cards actually render from. Plus the `'#888'` fallback and `'#e0e0e0'` multicolor text.
4. **`ParticleCanvas.tsx`** (lines 38–40): `CONFETTI_COLORS`, `SPARKLE_COLORS`, `EMBER_COLORS` — retune to the violet palette so particle effects match.

---

## File-by-file plan

| File | Action | What changes |
|------|--------|--------------|
| `frontend/src/index.css` | Modify | New `:root` palette + RGB-triplet + highlight tokens; route keyframe/spinner/pattern literals through vars; re-author `card-back-pattern` (arcane ✦ weave) and `border-multicolor`; add background-atmosphere class (layered violet gradient + starfield + corner glows); add card-depth and wordmark styles; add `--color-highlight` ring style. |
| `frontend/src/components/Card.tsx` | Modify | Update `COLOR_MAP` suit hexes + fallback/multicolor text to new palette; add faceup depth (inner-light + shadow). |
| `frontend/src/components/PlayerGrid.tsx` | Modify | Selectable-space / validated highlight uses `--color-highlight` (bright lavender), not accent. (Read first to locate the highlight + validated rendering.) |
| `frontend/src/components/GameBoard.tsx` | Modify | Apply background-atmosphere class to the board container; verify status-bar + header colors read correctly on violet. |
| `frontend/src/components/Display.tsx` | Modify | Verify card glow/spacing reads on violet (mostly inherited). |
| `frontend/src/components/Lobby.tsx` | Modify | PIKSI title → gradient wordmark class; verify the (just-committed) ambient sparkles + pulse animations read on violet. |
| `frontend/src/components/ParticleCanvas.tsx` | Modify | Retune `CONFETTI_COLORS`, `SPARKLE_COLORS`, `EMBER_COLORS` to violet palette. |
| `frontend/src/components/ScoreBreakdown.tsx` | Modify | Verify winner-highlight + counting rows read on violet (check for any literals). |
| `frontend/src/components/GameOver.tsx` | Modify | Verify win screen + confetti read on violet; wordmark if a title is shown. |
| `frontend/src/components/ChooseKeepModal.tsx` | Modify | Verify modal surface/border/text on violet (check for literals). |

> The "verify" components likely need only incidental tweaks, but each must be opened during implementation to catch any stray literals the grep surfaced — scope is "every screen," not just the board.

---

## Sequencing

0. **Commit the in-progress Lobby work first** (name persistence, copy-code, ambient sparkles — currently uncommitted) on its own commit, so the recolor diff is a clean "Twilight Arcane" change and not tangled with Lobby features. This keeps the eventual plannotator review readable.
1. Tokens + literal routing in `index.css` (foundation — everything builds on this).
2. Background atmosphere.
3. Cards (`Card.tsx` + css) including depth + card-back.
4. Chrome (headers, status, buttons, wordmark) across `GameBoard` / `Lobby`.
5. Particles retune.
6. Sweep the remaining screens (`Display`, `ScoreBreakdown`, `GameOver`, `ChooseKeepModal`) for stray literals + on-violet legibility.

---

## Testing / verification

- **Build:** `cd frontend && npm run build` passes (no broken CSS/TS).
- **Grep gate:** after the change, `grep -rEn '#e94560|233, ?69, ?96|#3B82F6|#22C55E|#EAB308|#EF4444|15, ?52, ?96' frontend/src` returns **no** matches — proves no old coral/navy/suit literals survive.
- **Manual (two browser tabs, real game):** lobby wordmark + sparkles; place a card (depth + flip); validate a card (lavender highlight, NOT rose); become your turn (status glow); complete a round (score reveal + confetti in new colors); win (game-over confetti). Squint-test: the four suits are still mutually distinguishable in a real hand.
- **Visual review:** run `/plannotator-review` on the diff to eyeball the recolor in-browser.

---

## Success criteria

- Every screen reads as one cohesive Twilight Arcane identity — no surviving coral or old navy anywhere.
- Suit colors remain mutually distinguishable; highlight state is clearly distinct from the rose suit.
- The palette is token-driven: a future re-theme is mostly a `:root` edit, not a literal hunt.
