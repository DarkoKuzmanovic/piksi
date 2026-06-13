# Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add card flip animations, turn/phase transitions, animated score reveals, particle effects, and write an asset guide for future art/sound work.

**Architecture:** All changes are frontend-only. A shared `ParticleCanvas` component renders particle effects on a fixed canvas overlay. A `useParticles` context provides an imperative API for any component to trigger effects. Card flip uses CSS 3D transforms. Score counting uses a `useCountUp` hook with requestAnimationFrame. State transition detection uses `useRef` to compare previous vs current values.

**Tech Stack:** React, CSS 3D transforms, Canvas API, requestAnimationFrame, Zustand (existing store)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `frontend/src/hooks/use-previous.ts` | Create | Generic `usePrevious` hook for detecting state changes |
| `frontend/src/hooks/use-count-up.ts` | Create | Animated number counter hook |
| `frontend/src/components/ParticleCanvas.tsx` | Create | Canvas overlay + particle system + React context |
| `frontend/src/components/Card.tsx` | Modify | 3D flip animation structure |
| `frontend/src/components/PlayerGrid.tsx` | Modify | Detect facedown→faceup transitions, card placement animation, trigger validation particles |
| `frontend/src/components/Display.tsx` | Modify | Staggered card entrance animation |
| `frontend/src/components/GameBoard.tsx` | Modify | Status bar transitions, last-turn particle trigger |
| `frontend/src/components/ScoreBreakdown.tsx` | Modify | Staggered row reveal + counting animation + round-win particles |
| `frontend/src/components/GameOver.tsx` | Modify | Win screen confetti |
| `frontend/src/App.tsx` | Modify | Wrap with ParticleProvider |
| `frontend/src/index.css` | Modify | New keyframes and 3D flip styles |
| `docs/asset-guide.md` | Create | Asset spec for card art, backgrounds, sound/music |

---

### Task 1: Utility Hooks

**Files:**
- Create: `frontend/src/hooks/use-previous.ts`
- Create: `frontend/src/hooks/use-count-up.ts`

- [ ] **Step 1: Create `usePrevious` hook**

```ts
import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

- [ ] **Step 2: Create `useCountUp` hook**

```ts
import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number, delay: number = 0): number {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = null;

      function tick(now: number) {
        if (startTime.current === null) startTime.current = now;
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));

        if (progress < 1) {
          rafId.current = requestAnimationFrame(tick);
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
  }, [target, duration, delay]);

  return current;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/use-previous.ts frontend/src/hooks/use-count-up.ts
git commit -m "feat: add usePrevious and useCountUp utility hooks"
```

---

### Task 2: Particle System

**Files:**
- Create: `frontend/src/components/ParticleCanvas.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create the particle system component with context**

`ParticleCanvas.tsx` should contain:

1. **Particle interface:**
   ```ts
   interface Particle {
     x: number; y: number;
     vx: number; vy: number;
     life: number; maxLife: number;
     size: number; color: string;
     gravity: number;
     rotation: number; rotationSpeed: number;
   }
   ```

2. **ParticleContext** providing an `emit` function:
   ```ts
   type EmitType = 'confetti' | 'sparkle' | 'embers';

   interface ParticleAPI {
     emit: (type: EmitType, x: number, y: number) => void;
   }
   ```

3. **`useParticles()` hook** to access the context.

4. **Emit presets:**
   - `confetti`: 80 particles, random colors from game palette, gravity 0.15, spread in all directions, rotation, life 2500ms
   - `sparkle`: 15 particles, gold/yellow colors, no gravity, small size, burst outward, life 500ms
   - `embers`: 30 particles, red/orange/yellow, negative gravity (float up), from status bar area, life 1000ms

5. **Canvas rendering:**
   - Fixed position, full viewport, `pointer-events: none`, z-index 60
   - `requestAnimationFrame` loop that only runs when particles exist
   - Each frame: update positions (x += vx, y += vy, vy += gravity), reduce life, fade opacity, draw rotated rectangles (confetti) or circles (sparkle/embers)
   - Remove dead particles, stop loop when array is empty

- [ ] **Step 2: Wrap App with ParticleProvider**

In `App.tsx`, import `ParticleProvider` from `ParticleCanvas.tsx` and wrap the return:

```tsx
import { ParticleProvider } from './components/ParticleCanvas';

// In the return:
return (
  <ParticleProvider>
    {errorToast}
    {content}
  </ParticleProvider>
);
```

- [ ] **Step 3: Verify the app still renders correctly**

Run: `cd frontend && npm run dev`
Check: App loads, no console errors. Canvas element is present in DOM but invisible (no particles yet).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ParticleCanvas.tsx frontend/src/App.tsx
git commit -m "feat: add particle system with canvas overlay and context API"
```

---

### Task 3: Card Flip Animation

**Files:**
- Modify: `frontend/src/index.css`
- Modify: `frontend/src/components/Card.tsx`
- Modify: `frontend/src/components/PlayerGrid.tsx`

- [ ] **Step 1: Add 3D flip CSS to `index.css`**

Add after the existing animations:

```css
/* 3D Card Flip */
.card-flip-container {
  perspective: 800px;
}

.card-flip-inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-out;
}

.card-flip-inner.flipped {
  transform: rotateY(180deg);
}

.card-flip-front,
.card-flip-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-flip-front {
  position: relative;
}

.card-flip-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
}

/* Card placement scale-in */
@keyframes card-place {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-card-place {
  animation: card-place 0.3s ease-out forwards;
}
```

- [ ] **Step 2: Refactor `Card.tsx` to support flip animation**

Add a `flipping` prop to `CardProps`. When `flipping` is true, the card renders both faces in a 3D flip container:

- The component always renders a single card (no structural change for non-flipping cards)
- When `flipping` is true:
  - Wrap in `.card-flip-container`
  - Inner div gets `.card-flip-inner.flipped` (starts flipped = showing back face = the real card)
  - `.card-flip-front` contains the card-back pattern (what was showing before)
  - `.card-flip-back` contains the actual faceup card content
- When `flipping` is false: render as before (no wrapper)

Add a `placing` prop too. When true, apply `.animate-card-place` class to the outermost div.

- [ ] **Step 3: Update `PlayerGrid.tsx` to detect transitions and pass animation props**

```tsx
import { useState, useEffect } from 'react';
import { usePrevious } from '../hooks/use-previous';

// Inside PlayerGrid component:
const prevBoard = usePrevious(board);
const [flippingSpaces, setFlippingSpaces] = useState<Set<SpaceNumber>>(new Set());
const [placingSpaces, setPlacingSpaces] = useState<Set<SpaceNumber>>(new Set());

useEffect(() => {
  if (!prevBoard) return;
  const newFlipping = new Set<SpaceNumber>();
  const newPlacing = new Set<SpaceNumber>();

  for (let i = 1; i <= 9; i++) {
    const n = i as SpaceNumber;
    const prev = prevBoard[n].state;
    const curr = board[n].state;

    // Facedown -> faceup/validated = flip
    if (prev === 'FACEDOWN_ONLY' && (curr === 'FACEUP_ONLY' || curr === 'VALIDATED')) {
      newFlipping.add(n);
    }
    // Empty -> facedown = placement
    if (prev === 'EMPTY' && curr === 'FACEDOWN_ONLY') {
      newPlacing.add(n);
    }
  }

  if (newFlipping.size > 0) {
    setFlippingSpaces(newFlipping);
    setTimeout(() => setFlippingSpaces(new Set()), 650);
  }
  if (newPlacing.size > 0) {
    setPlacingSpaces(newPlacing);
    setTimeout(() => setPlacingSpaces(new Set()), 350);
  }
}, [board, prevBoard]);
```

Pass `flipping={flippingSpaces.has(spaceNum)}` and `placing={placingSpaces.has(spaceNum)}` to `<Card>` in the appropriate cases:
- `FACEUP_ONLY` and `VALIDATED` cases: pass `flipping`
- `FACEDOWN_ONLY` case: pass `placing`

- [ ] **Step 4: Test manually**

Run: `cd frontend && npm run dev`
Open two browser tabs, create + join a game. Pick a card and place it — should see scale-in animation on placement. When the card flips faceup, should see 3D flip.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/index.css frontend/src/components/Card.tsx frontend/src/components/PlayerGrid.tsx
git commit -m "feat: add 3D card flip and placement animations"
```

---

### Task 4: Turn/Phase Transitions

**Files:**
- Modify: `frontend/src/components/Display.tsx`
- Modify: `frontend/src/components/GameBoard.tsx`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add transition keyframes to `index.css`**

```css
/* Status bar flash when it becomes your turn */
@keyframes turn-flash {
  0% { filter: brightness(1); }
  30% { filter: brightness(1.8); }
  100% { filter: brightness(1); }
}

.animate-turn-flash {
  animation: turn-flash 0.4s ease-out;
}

/* Staggered card entrance */
@keyframes card-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-card-enter {
  animation: card-enter 0.3s ease-out forwards;
  opacity: 0;
}
```

- [ ] **Step 2: Add staggered entrance to `Display.tsx`**

Use `usePrevious` to detect when display cards change (new set of cards appears). Track a `entering` state boolean.

When new cards are detected (different `cardTypeId`s than previous), set `entering = true`, then clear after 400ms.

When `entering` is true, each card wrapper gets:
```tsx
className={`animate-card-enter`}
style={{ animationDelay: `${index * 80}ms` }}
```

- [ ] **Step 3: Add turn-change flash to `GameBoard.tsx`**

Use `usePrevious(myTurn)`. When `prevMyTurn === false && myTurn === true`, set a `turnFlash` state to true, clear after 500ms.

Apply `animate-turn-flash` class to the status bar div when `turnFlash` is true.

- [ ] **Step 4: Add status text crossfade**

In `GameBoard.tsx`, use `statusText` as a `key` on the status text `<div>` so React remounts it. Apply the existing `animate-fade-in` class:

```tsx
<div key={statusText} className="animate-fade-in">{statusText}</div>
```

- [ ] **Step 5: Test manually**

Run the dev server. In a game, watch display cards appear with staggered animation. When it becomes your turn, status bar should flash. Status text should crossfade on change.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/index.css frontend/src/components/Display.tsx frontend/src/components/GameBoard.tsx
git commit -m "feat: add turn/phase transition animations"
```

---

### Task 5: Score Reveal Animation

**Files:**
- Modify: `frontend/src/components/ScoreBreakdown.tsx`

- [ ] **Step 1: Rewrite `ScoreBreakdown.tsx` with staggered reveal and counting**

Key changes:

1. **Row visibility state:** `const [visibleRows, setVisibleRows] = useState(0);`

   On mount, increment `visibleRows` every 400ms up to 5 (validated, symbols, zone, divider+round, cumulative):
   ```ts
   useEffect(() => {
     const timers = [0, 400, 800, 1200, 1800].map((delay, i) =>
       setTimeout(() => setVisibleRows(i + 1), delay)
     );
     return () => timers.forEach(clearTimeout);
   }, []);
   ```

2. **Counting numbers:** Use `useCountUp` for each score value, with matching delays:
   - `useCountUp(myValidated, 600, 0)` — starts immediately
   - `useCountUp(mySymbols, 600, 400)` — starts when row 2 appears
   - `useCountUp(myZone, 600, 800)` — starts when row 3 appears
   - `useCountUp(myTotal, 600, 1200)` — starts when total row appears
   - Same for opponent values

3. **Row rendering:** Each row gets `opacity: 0` by default, `animate-slide-up` class when `visibleRows >= rowIndex`.

4. **Winner highlight:** When `visibleRows >= 4` (round total visible), if `myTotal > opTotal`, the player's round total gets `text-[var(--color-green)]`, opponent gets default. Vice versa for opponent winning.

5. **Round-win particles:** When `visibleRows` reaches 4 and the player won the round, call `particles.emit('confetti', ...)` centered on the score modal. Import `useParticles` from `ParticleCanvas`.

6. **Button:** Only appears (fade-in) when `visibleRows >= 5`.

- [ ] **Step 2: Test manually**

Open a game, complete a round. Score breakdown should animate row by row with numbers counting up. If you won the round, confetti should fire.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ScoreBreakdown.tsx
git commit -m "feat: add animated score reveal with counting and staggered rows"
```

---

### Task 6: Particle Triggers

**Files:**
- Modify: `frontend/src/components/PlayerGrid.tsx`
- Modify: `frontend/src/components/GameBoard.tsx`
- Modify: `frontend/src/components/GameOver.tsx`

- [ ] **Step 1: Validation sparkles in `PlayerGrid.tsx`**

When detecting state transitions (same `useEffect` from Task 3), also detect:
- `prev !== 'VALIDATED' && curr === 'VALIDATED'` → trigger sparkle

Add a `ref` to each card's wrapper div in the grid (keyed by space number). When a validation transition is detected, call `cardRefs[spaceNum].current.getBoundingClientRect()` to get the exact screen position, then call `particles.emit('sparkle', rect.x + rect.width/2, rect.y + rect.height/2)`.

Use `useParticles()` to get the emit function. Use `useRef<Record<SpaceNumber, HTMLDivElement | null>>` to hold card element refs.

- [ ] **Step 2: Last-turn embers in `GameBoard.tsx`**

Use `usePrevious(gameState?.lastTurnTriggered)`. When it transitions from `false` to `true`:
- Get the status bar element ref's bounding rect
- Call `particles.emit('embers', centerX, statusBarY)`

- [ ] **Step 3: Win screen confetti in `GameOver.tsx`**

On mount (if the player won), fire confetti:
```ts
const particles = useParticles();

useEffect(() => {
  if (myTotal > opTotal) {
    particles.emit('confetti', window.innerWidth / 2, window.innerHeight / 3);
  }
}, [particles, myTotal, opTotal]);
```

- [ ] **Step 4: Test manually**

Play through a game. Validate a card — sparkles should appear on the card. Trigger last turn — embers should rise from the status bar. Win a game — confetti should burst.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/PlayerGrid.tsx frontend/src/components/GameBoard.tsx frontend/src/components/GameOver.tsx
git commit -m "feat: add particle effects for validation, last turn, and win"
```

---

### Task 7: Asset Guide Document

**Files:**
- Create: `docs/asset-guide.md`

- [ ] **Step 1: Write the asset guide**

The document should cover three sections:

**Card Art (9 illustrations):**
- One pixel-art icon per card number (1-9)
- Dimensions: 64x64px (will be scaled down to ~40x40 in cards)
- Format: SVG preferred, PNG acceptable (2x for retina: 128x128)
- Color: each on transparent background, should work on dark (#16213e) card background
- Style: pixel-art, matching Pixelify Sans aesthetic, fairy/nature theme
- List each card number with a suggested subject (e.g., 1=single pixie, 2=pair of mushrooms, etc.)

**Card Back Design:**
- Dimensions: 88x112px (2x: 176x224)
- Replace the CSS diagonal pattern with an illustrated back
- Should include the Piksi logo/brand mark
- Format: SVG or PNG

**Background/Table:**
- Full-screen tileable texture or gradient
- Dark theme (current base: #1a1a2e)
- Subtle — should not compete with cards
- Format: SVG pattern or PNG tile (256x256)

**UI Elements:**
- Panel/frame borders for the grid areas
- Divider/separator decoration for between opponent and player boards
- Format: SVG 9-slice or CSS border-image

**Sound Effects:**
- List each event with suggested duration and format:
  - Card place: ~200ms, percussive tap
  - Card flip: ~400ms, paper/whoosh
  - Card validate: ~300ms, chime/sparkle
  - Turn start (your turn): ~300ms, soft notification
  - Last turn trigger: ~600ms, dramatic sting
  - Round complete: ~500ms, fanfare
  - Game win: ~1500ms, victory jingle
  - Game lose: ~800ms, deflating tone
- Format: MP3 + OGG (for browser compat), 44.1kHz, mono
- Style: 8-bit/chiptune to match pixel aesthetic

**Music:**
- Background loop for gameplay: 30-60s, seamless loop
- Lobby/menu loop: 15-30s, lighter feel
- Format: MP3 + OGG, 44.1kHz, stereo
- Style: lo-fi chiptune, relaxed tempo, non-distracting

- [ ] **Step 2: Commit**

```bash
git add docs/asset-guide.md
git commit -m "docs: add asset guide for card art, backgrounds, sound, and music"
```

---

### Summary

| Task | What | Dependencies |
|------|------|-------------|
| 1 | Utility hooks | None |
| 2 | Particle system | None |
| 3 | Card flip animation | Task 1 |
| 4 | Turn/phase transitions | Task 1 |
| 5 | Score reveal animation | Tasks 1, 2 |
| 6 | Particle triggers | Tasks 2, 3 |
| 7 | Asset guide | None |

Tasks 1, 2, and 7 can be done in parallel. Task 3 and 4 depend on Task 1. Task 5 depends on 1+2. Task 6 depends on 2+3.
