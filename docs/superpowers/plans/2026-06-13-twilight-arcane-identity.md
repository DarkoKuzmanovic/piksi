# Twilight Arcane Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recolor and restyle Piksi from the navy+coral look into a cohesive **Twilight Arcane** identity — starlit violet with magenta accents — across every screen.

**Architecture:** Token-first. The palette lives in `index.css` `:root` custom properties; hardcoded color literals (keyframes, patterns, JS color maps, particle arrays) are routed through those tokens or updated to match, so future re-themes are mostly a `:root` edit. A global starfield atmosphere is added to `body`. Card depth, the gradient wordmark, and a lavender highlight ring are new CSS utilities. No layout or logic changes; no new art assets.

**Tech Stack:** CSS custom properties, Tailwind v4 (arbitrary values), React, Canvas (existing particle system).

**Spec:** `docs/superpowers/specs/2026-06-13-twilight-arcane-identity-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `frontend/src/index.css` | Modify | New `:root` palette + RGB-triplet + highlight tokens; route keyframe/pattern/spinner literals through tokens; re-author `card-back-pattern` + `border-multicolor`; add body atmosphere + starfield, `.wordmark`, `.card-face-depth`, `pulse-highlight`. |
| `frontend/src/components/Card.tsx` | Modify | Update `COLOR_MAP` suit hexes + fallbacks; switch highlight/selected from accent → `--color-highlight`; add depth class; facedown glyph `?` → `✦`. |
| `frontend/src/components/ParticleCanvas.tsx` | Modify | Retune `CONFETTI_COLORS`, `SPARKLE_COLORS`, `EMBER_COLORS` to the violet palette. |
| `frontend/src/components/Lobby.tsx` | Modify | PIKSI titles → `.wordmark` class. |
| _Display / ScoreBreakdown / GameOver / ChooseKeepModal_ | Verify only | No color literals (confirmed by grep) — inherit from `:root`. Visual check only. |

---

### Task 1: Clean the working tree first

The recolor heavily edits `index.css` and `Lobby.tsx`, which already have uncommitted in-progress work (name persistence, copy-code, ambient sparkles). Commit that first so the recolor diff is readable and the eventual plannotator review isn't tangled.

**Files:** (commit existing changes — no new edits)

- [ ] **Step 1: Review what's uncommitted**

Run: `git status && git diff --stat`
Expected: modified `Lobby.tsx`, `index.css`, `docs/asset-guide.md`, `docs/superpowers/plans/2026-03-15-game-engine.md`, untracked `docs/superpowers/plans/2026-03-17-visual-polish.md`.

- [ ] **Step 2: Commit the Lobby feature work**

```bash
git add frontend/src/components/Lobby.tsx frontend/src/index.css
git commit -m "feat: persist player name, copy room code, ambient lobby sparkles"
```

- [ ] **Step 3: Commit the stray doc changes (keeps the tree clean)**

```bash
git add docs/asset-guide.md docs/superpowers/plans/2026-03-15-game-engine.md docs/superpowers/plans/2026-03-17-visual-polish.md
git commit -m "docs: update asset guide and plan notes"
```

- [ ] **Step 4: Verify clean tree**

Run: `git status`
Expected: "nothing to commit, working tree clean".

---

### Task 2: Palette tokens + literal routing (foundation)

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace the `:root` block**

Replace the existing `:root { ... }` (lines ~4–15) with:

```css
:root {
  /* Twilight Arcane palette */
  --color-bg: #140d24;
  --color-bg-card: #1f1640;
  --color-bg-surface: #2c1d52;
  --color-text: #e8e0f5;
  --color-text-muted: #9a86c8;
  --color-blue: #6ea8ff;
  --color-green: #5ce6b0;
  --color-yellow: #ffcf5c;
  --color-red: #ff7b9c;
  --color-accent: #ff5ca8;
  --color-lavender: #c8a8ff;
  --color-highlight: #e6d8ff;
  /* RGB triplets for alpha-composited glows/patterns */
  --color-accent-rgb: 255 92 168;
  --color-lavender-rgb: 200 168 255;
}
```

- [ ] **Step 2: Route the `pulse-glow` and `pulse-border` keyframes through the accent token**

Replace the two keyframe blocks:

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 4px rgb(var(--color-accent-rgb) / 0.4); }
  50% { box-shadow: 0 0 12px rgb(var(--color-accent-rgb) / 0.8); }
}

@keyframes pulse-border {
  0%, 100% { border-color: rgb(var(--color-accent-rgb) / 0.4); }
  50% { border-color: rgb(var(--color-accent-rgb) / 1); }
}
```

- [ ] **Step 3: Re-author `card-back-pattern` to the arcane violet weave**

Replace the `.card-back-pattern` rule:

```css
.card-back-pattern {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      rgb(var(--color-lavender-rgb) / 0.10) 4px,
      rgb(var(--color-lavender-rgb) / 0.10) 8px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 4px,
      rgb(var(--color-accent-rgb) / 0.10) 4px,
      rgb(var(--color-accent-rgb) / 0.10) 8px
    );
  background-color: var(--color-bg-card);
}
```

- [ ] **Step 4: Token-drive `border-multicolor`**

Replace the `.border-multicolor` rule:

```css
.border-multicolor {
  border-image: linear-gradient(135deg, var(--color-blue), var(--color-green), var(--color-yellow), var(--color-red)) 1;
}
```

- [ ] **Step 5: Route the lobby spinner border through the accent token**

In `.lobby-spinner`, replace the border line:

```css
  border: 3px solid rgb(var(--color-accent-rgb) / 0.3);
```

(Leave `border-top-color: var(--color-accent);` as-is.)

- [ ] **Step 6: Build and grep-gate**

Run: `cd frontend && npm run build`
Expected: build succeeds.

Run: `grep -rEn '#e94560|233, ?69, ?96|15, ?52, ?96' frontend/src/index.css`
Expected: **no matches** (no surviving coral or old-navy literals in CSS).

- [ ] **Step 7: Commit**

```bash
git add frontend/src/index.css
git commit -m "feat: recolor palette tokens to Twilight Arcane (violet/magenta)"
```

---

### Task 3: Atmosphere, wordmark, card depth, highlight ring (new CSS)

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add the starlit-violet atmosphere to `body`**

In the existing `body { ... }` rule, replace the line `background-color: var(--color-bg);` with:

```css
  background-color: var(--color-bg);
  background-image:
    radial-gradient(140px 120px at 85% 6%, rgb(var(--color-accent-rgb) / 0.10), transparent 70%),
    radial-gradient(180px 150px at 10% 96%, rgb(var(--color-lavender-rgb) / 0.10), transparent 70%),
    radial-gradient(circle at 50% 35%, #241844 0%, #1a1230 55%, #140d24 100%);
  background-attachment: fixed;
```

- [ ] **Step 2: Add the starfield layer and lift `#root` above it**

Add after the `body { ... }` rule:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
  background-image:
    radial-gradient(1px 1px at 20% 18%, #fff, transparent),
    radial-gradient(1px 1px at 70% 12%, var(--color-lavender), transparent),
    radial-gradient(1px 1px at 40% 30%, #fff, transparent),
    radial-gradient(1px 1px at 85% 45%, var(--color-lavender), transparent),
    radial-gradient(1px 1px at 30% 62%, #fff, transparent),
    radial-gradient(1px 1px at 60% 78%, var(--color-lavender), transparent),
    radial-gradient(1px 1px at 15% 85%, var(--color-lavender), transparent),
    radial-gradient(1px 1px at 92% 80%, #fff, transparent);
}
```

Then in the existing `#root { ... }` rule, add:

```css
  position: relative;
  z-index: 1;
```

- [ ] **Step 2b: Build to verify the atmosphere renders without breaking layout**

Run: `cd frontend && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Add the gradient wordmark, card depth, and lavender highlight utilities**

Append to `index.css`:

```css
/* Gradient wordmark (PIKSI) */
.wordmark {
  background: linear-gradient(135deg, var(--color-lavender), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  filter: drop-shadow(0 0 18px rgb(var(--color-lavender-rgb) / 0.4));
}

/* Faceup card depth */
.card-face-depth {
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06), 0 2px 6px rgb(0 0 0 / 0.4);
}

/* Lavender highlight ring (selectable / validated) — distinct from rose suit */
@keyframes pulse-highlight {
  0%, 100% { border-color: rgb(var(--color-lavender-rgb) / 0.5); box-shadow: 0 0 6px rgb(var(--color-lavender-rgb) / 0.3); }
  50% { border-color: rgb(var(--color-lavender-rgb) / 1); box-shadow: 0 0 14px rgb(var(--color-lavender-rgb) / 0.6); }
}

.animate-pulse-highlight {
  animation: pulse-highlight 1.5s ease-in-out infinite;
}
```

- [ ] **Step 4: Build and commit**

Run: `cd frontend && npm run build`
Expected: build succeeds.

```bash
git add frontend/src/index.css
git commit -m "feat: add starfield atmosphere, gradient wordmark, card depth, highlight ring"
```

---

### Task 4: Card styling (`Card.tsx`)

**Files:**
- Modify: `frontend/src/components/Card.tsx`

- [ ] **Step 1: Update `COLOR_MAP` to the new suit hues**

Replace the `COLOR_MAP` object (lines 3–8):

```ts
const COLOR_MAP: Record<string, string> = {
  blue: '#6ea8ff',
  green: '#5ce6b0',
  yellow: '#ffcf5c',
  red: '#ff7b9c',
};
```

- [ ] **Step 2: Switch the empty-space highlight from accent to lavender**

In the empty-space `<button>` className, replace the highlighted branch line:

```tsx
          ${highlighted
            ? 'border-2 border-[var(--color-highlight)] animate-pulse-highlight cursor-pointer hover:scale-105'
            : 'border-2 border-dashed border-[var(--color-text-muted)]/30'
          }
```

- [ ] **Step 3: Switch the faceup `selected` ring from accent to lavender, and add depth**

In the faceup `<button>` className, replace the `selected` line and add the depth class:

```tsx
        ${baseSize} rounded-lg relative card-face-depth
        ${borderStyle}
        bg-[var(--color-bg-card)]
        flex flex-col items-center justify-between p-1.5
        transition-all duration-200
        ${selected ? 'scale-110 shadow-lg shadow-[var(--color-highlight)]/50 ring-2 ring-[var(--color-highlight)]' : ''}
        ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
```

- [ ] **Step 4: Update the multicolor number text color to the lavender-white text token**

Replace line ~107:

```tsx
        style={{ color: isMulticolor ? 'var(--color-text)' : primaryColor }}
```

- [ ] **Step 5: Theme the facedown glyph (two spots: standalone facedown + flip front face)**

Replace both occurrences of the facedown glyph span content `?` with `✦`:

Standalone facedown (line ~65):

```tsx
        <span className={`${small ? 'text-lg' : 'text-2xl'} opacity-30`}>✦</span>
```

Flip front face (line ~149):

```tsx
            <span className={`${small ? 'text-lg' : 'text-2xl'} opacity-30`}>✦</span>
```

- [ ] **Step 6: Build and commit**

Run: `cd frontend && npm run build`
Expected: build succeeds.

```bash
git add frontend/src/components/Card.tsx
git commit -m "feat: recolor cards, lavender highlight ring, card depth, arcane facedown glyph"
```

---

### Task 5: Particle colors (`ParticleCanvas.tsx`)

**Files:**
- Modify: `frontend/src/components/ParticleCanvas.tsx`

- [ ] **Step 1: Retune the three color arrays**

Replace lines 38–40:

```ts
const CONFETTI_COLORS = ['#6ea8ff', '#5ce6b0', '#ffcf5c', '#ff7b9c', '#ff5ca8', '#c8a8ff'];
const SPARKLE_COLORS = ['#ffcf5c', '#fde047', '#c8a8ff'];
const EMBER_COLORS = ['#ff5ca8', '#c8a8ff', '#ffcf5c'];
```

- [ ] **Step 2: Build and commit**

Run: `cd frontend && npm run build`
Expected: build succeeds.

```bash
git add frontend/src/components/ParticleCanvas.tsx
git commit -m "feat: retune particle colors to Twilight Arcane palette"
```

---

### Task 6: Wordmark in the lobby (`Lobby.tsx`)

**Files:**
- Modify: `frontend/src/components/Lobby.tsx`

- [ ] **Step 1: Apply `.wordmark` to the waiting-screen title**

Replace the `<h1>` on line ~55:

```tsx
        <h1 className="text-5xl font-bold wordmark mb-2 tracking-wider animate-pulse-glow rounded-lg">
          PIKSI
        </h1>
```

- [ ] **Step 2: Apply `.wordmark` to the main-screen title**

Replace the `<h1>` on line ~106:

```tsx
        <h1 className="text-6xl font-bold wordmark tracking-wider animate-pulse-glow rounded-lg px-4 py-2">
          PIKSI
        </h1>
```

- [ ] **Step 3: Build and commit**

Run: `cd frontend && npm run build`
Expected: build succeeds.

```bash
git add frontend/src/components/Lobby.tsx
git commit -m "feat: PIKSI gradient wordmark in lobby"
```

---

### Task 7: Verification sweep

**Files:** (no edits expected — verify only)

- [ ] **Step 1: Confirm no old literals survive anywhere in src**

Run: `grep -rEn '#e94560|233, ?69, ?96|#3B82F6|#22C55E|#EAB308|#EF4444|15, ?52, ?96|#1a1a2e|#16213e|#0f3460' frontend/src`
Expected: **no matches**. If any appear in `Display.tsx`, `ScoreBreakdown.tsx`, `GameOver.tsx`, or `ChooseKeepModal.tsx`, update them to the matching new token/hex and re-run.

- [ ] **Step 2: Production build**

Run: `cd frontend && npm run build`
Expected: build succeeds, no TS/CSS errors.

- [ ] **Step 3: Manual play-through (two browser tabs)**

Run: `cd frontend && npm run dev` (and `cd backend && npm run dev` in another shell).
Open two tabs, create + join a game. Verify on the violet theme:
- Lobby: gradient PIKSI wordmark, ambient sparkles, name persists on reload, copy-code works.
- Place a card: scale-in + depth visible.
- Card flips faceup: 3D flip, suit number legible (periwinkle/mint/gold/rose).
- Selectable empty space: **lavender** pulsing ring (NOT magenta/rose).
- Validate a card / your turn: status bar glows; sparkle particles in new palette.
- Complete a round: score reveal + confetti in violet palette.
- Win: game-over confetti.
- **Squint test:** the four suit colors stay mutually distinguishable in a real hand.

- [ ] **Step 4: Visual diff review**

Run `/plannotator-review` to eyeball the full recolor diff in-browser; address any annotations.

---

## Notes for the implementer

- This is a styling change: there are no unit tests. "Done" = production build passes + the grep gate returns nothing + the manual play-through looks right.
- `rgb(var(--token-rgb) / <alpha>)` is the modern space-separated syntax and resolves correctly inside `@keyframes` — that's the whole reason for the `-rgb` triplet tokens.
- If the starfield feels too busy or the atmosphere too strong during the manual pass, tune `body::before { opacity }` and the `body` radial-gradient alpha values — they're the two knobs, no structural change needed.
