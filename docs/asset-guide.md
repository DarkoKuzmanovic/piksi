# Piksi Asset Guide

This guide covers all visual and audio assets for Piksi, the 2-player online pixel-art pixies card game.

**Design Theme:** Whimsical pixel-art fairy/nature aesthetic with dark navy color scheme
**Font:** Pixelify Sans (used throughout UI)
**Color Palette:**
- Background: `#1a1a2e` (dark navy)
- Card Background: `#16213e` (darker blue)
- Surface: `#0f3460`
- Blue: `#3B82F6`
- Green: `#22C55E`
- Yellow: `#EAB308`
- Red: `#EF4444`
- Accent/Pink: `#e94560`
- Text: `#e0e0e0`
- Muted Text: `#8888aa`

---

## Card Art — Numbered Icons (1–9)

Each card number (1–9) requires a unique pixel-art illustration. Cards are displayed at ~40×40px in gameplay but created at larger dimensions for retina displays.

### Specifications

| Property | Value |
|----------|-------|
| **Dimensions** | 64×64px (1x), 128×128px (2x retina) |
| **Format** | SVG preferred; PNG acceptable |
| **Background** | Transparent |
| **Style** | Pixel-art, 8-bit aesthetic, fairy/nature theme |
| **Target Background** | Works on dark card background (`#16213e`) |

### Card Descriptions

| Card | Theme | Suggested Subject |
|------|-------|-------------------|
| **1** | Single | Solitary pixie figure, wings outstretched |
| **2** | Pair | Two pixies facing each other, or pair of mushrooms |
| **3** | Trinity | Three stars, three flowers, or three magical orbs |
| **4** | Cluster | Four-leaf clover, four gems, or pixie ring |
| **5** | Quintet | Five fireflies in formation, or five petals |
| **6** | Hexagon | Six-pointed star, honeycomb pattern, or crystal cluster |
| **7** | Septet | Seven glowing wisps or magical sparkles |
| **8** | Octave | Eight-pointed star or flower with eight petals |
| **9** | Full Circle | Large pixie, full wings, surrounded by magical aura |

**Implementation Notes:**
- Each icon should be centered and leave ~8px padding on all sides
- Use the accent colors (blue, green, yellow, red, pink) strategically to make each card visually distinct
- Maintain consistent line weight and pixel density across all cards
- Consider thematic connections between numbers (e.g., 1 is small/simple, 9 is large/complex)

**File Locations:**
```
frontend/public/assets/cards/
  card-1.svg (or .png)
  card-1@2x.png (if PNG format)
  card-2.svg
  card-2@2x.png
  ...
  card-9.svg
  card-9@2x.png
```

---

## Card Back Design

The card back is the face-down card display seen when cards are hidden. Currently uses a CSS diagonal stripe pattern; this should be replaced with an illustrated design.

### Specifications

| Property | Value |
|----------|-------|
| **Dimensions** | 88×112px (1x), 176×224px (2x retina) |
| **Format** | SVG preferred; PNG acceptable |
| **Background** | Solid (`#16213e`) or gradient overlay |
| **Content** | Piksi logo/brand mark, decorative border |
| **Style** | Matches pixel-art aesthetic, fairy/magical theme |

### Design Considerations

- **Branding:** Include a stylized "Piksi" logo, monogram, or brand mark at center or top
- **Symmetry:** Design should be centered and balanced (cards appear in grid)
- **Subtlety:** Should not be too busy—players need to focus on flipped cards during play
- **Magical Theme:** Use stars, sparkles, glowing orbs, or ethereal symbols
- **Border Decoration:** Ornate pixel-art border frame that fits card dimensions

**Implementation Notes:**
- File should be referenced in `frontend/src/index.css` (replace `.card-back-pattern` background-image)
- If using SVG, embed as background-image with base64 encoding or reference via URL
- Ensure adequate contrast so white/light text remains readable if needed

**File Location:**
```
frontend/public/assets/
  card-back.svg (or .png)
  card-back@2x.png (if PNG)
```

---

## Background & Table Texture

Full-screen background texture or gradient that serves as the play surface. Should be subtle and non-distracting to avoid competing with game elements.

### Specifications

| Property | Value |
|----------|-------|
| **Dimensions** | 256×256px (tileable pattern) or full-screen gradient |
| **Format** | SVG pattern or PNG tile |
| **Color Scheme** | Dark theme, based on `#1a1a2e` |
| **Style** | Subtle texture (fabric, noise, subtle gradient, wood grain) |
| **Opacity** | Semi-transparent or low-contrast for subtlety |

### Design Options

1. **Tileable Texture Tile:** Seamless 256×256px PNG or SVG pattern
   - Pixel-art stipple or noise
   - Subtle diagonal weave
   - Magical sparkle/stardust pattern
   - Wood or fabric texture with minimal detail

2. **CSS Gradient:** Radial or linear gradient for simplicity
   - Base color: `#1a1a2e`
   - Darker at edges: `#0f0f1f`
   - Optional subtle vignette effect

**Implementation Notes:**
- If tileable, apply via `background-image: url()` and `background-repeat: repeat`
- Should tile seamlessly (no visible seams when repeated)
- Keep opacity low (~5–15% for patterns) so cards and UI remain legible
- Consider using `background-size` to control tile scale

**File Location:**
```
frontend/public/assets/
  bg-texture.svg or bg-texture.png
```

---

## UI Elements — Panels & Decorative Borders

Decorative frames and dividers for the game board layout. These include borders for opponent board, player board, and separator decorations between them.

### Specifications

| Property | Value |
|----------|-------|
| **Format** | SVG 9-slice, CSS border-image, or modular PNG corners/edges |
| **Style** | Pixel-art, ornate frame design, fairy/magical theme |
| **Colors** | Use accent colors (blue, green, yellow, red, pink) or multi-color gradient |
| **Thickness** | 4–8px (adjustable based on design) |

### Panel Types

#### 1. Card Grid Frame
- Rectangular border for opponent's card grid (top)
- Rectangular border for player's card grid (bottom)
- Minimal inner padding
- Could glow slightly on hover or during active turn

**Suggested Design:**
- Ornate pixel-art corner decorations
- Gradient or multi-color border (using `border-multicolor` from index.css: blue → green → yellow → red)
- Subtle shadow or inner glow

#### 2. Center Divider
- Horizontal separator line between opponent and player boards
- Should be decorative but not visually heavy
- Could include a small icon or brand mark at center

**Suggested Design:**
- Horizontal bar with pixelated ornaments at center
- Alternating color pattern or gradient
- Optional sparkles or magical symbols

#### 3. Information Panels
- Borders for status displays (turn indicator, scores, game state)
- Consistent with card grid frames
- Smaller scale

### Implementation Options

**Option A: SVG 9-Slice**
- Single SVG file with corners, edges, and center sections
- Scale elements independently for any size
- Best for flexibility

**Option B: CSS border-image**
- PNG or SVG border pattern
- Define corner size, edge repeat behavior
- Applied directly to HTML elements

**Option C: Modular PNG Corners + Edges**
- Separate PNG files for corners, horizontal edges, vertical edges
- Composite in CSS or via HTML `<div>` elements
- Good for pixel-perfect control

**File Location:**
```
frontend/public/assets/ui/
  frame-grid.svg (or frame-grid-border.png)
  divider-center.svg (or divider-center.png)
  panel-border.svg (modular pieces if needed)
```

---

## Sound Effects

Percussive and musical sound effects for game actions. Each effect should be short, punchy, and complement the 8-bit pixel aesthetic.

### Specifications

| Property | Value |
|----------|-------|
| **Format** | MP3 + OGG (browser compatibility) |
| **Sample Rate** | 44.1 kHz |
| **Channels** | Mono |
| **Loudness** | Normalize to –14dBFS (moderate level, leaves headroom) |
| **Style** | 8-bit/chiptune, retro video game aesthetic |

### Sound Effects Library

| Event | Duration | Tone | Suggested Sound | File Name |
|-------|----------|------|-----------------|-----------|
| **Card Place** | ~200ms | Percussive tap | Short beep, wood tap, or soft click | `sfx-card-place.mp3` |
| **Card Flip** | ~400ms | Paper whoosh | Swish, flutter, or page turn | `sfx-card-flip.mp3` |
| **Card Validate** | ~300ms | Chime/sparkle | Ascending bell, sparkle chime, or success ding | `sfx-card-validate.mp3` |
| **Turn Start (Your Turn)** | ~300ms | Soft notification | Gentle bell, notification ping, or alert chime | `sfx-turn-start.mp3` |
| **Last Turn Trigger** | ~600ms | Dramatic sting | Ascending notes, dramatic drum hit, or fanfare accent | `sfx-last-turn.mp3` |
| **Round Complete** | ~500ms | Fanfare | Triumphant jingle, ascending notes, or victory accent | `sfx-round-complete.mp3` |
| **Game Win** | ~1500ms | Victory jingle | Full victorious fanfare, celebratory chimes, or ending theme | `sfx-game-win.mp3` |
| **Game Lose** | ~800ms | Deflating tone | Descending notes, sad trombone, or deflating sound | `sfx-game-lose.mp3` |

### Design Notes

- **Card Place:** Quick, crisp tap—should feel responsive and immediate
- **Card Flip:** Smooth whoosh—convey motion and reveal expectation
- **Card Validate:** Uplifting chime—positive reinforcement when placement is valid
- **Turn Start:** Gentle notification—not jarring, signals player's turn
- **Last Turn Trigger:** Builds tension—dramatic but not harsh, alert player to final round
- **Round Complete:** Celebratory—acknowledge successful round, transition to scoring
- **Game Win:** Triumphant—reward and celebration (longer, more elaborate)
- **Game Lose:** Graceful—not mocking, gentle letdown (descending, soft)

### Implementation Notes

- Provide both MP3 and OGG files for maximum browser compatibility (`.ogg` for Firefox, Opera; `.mp3` for others)
- Test volume levels across different systems and browsers
- Consider ducking background music during important sound effects
- All effects should be **non-verbal** (no voice) for universal appeal
- Store in `frontend/public/assets/sounds/`

**File Location:**
```
frontend/public/assets/sounds/
  sfx-card-place.mp3 / .ogg
  sfx-card-flip.mp3 / .ogg
  sfx-card-validate.mp3 / .ogg
  sfx-turn-start.mp3 / .ogg
  sfx-last-turn.mp3 / .ogg
  sfx-round-complete.mp3 / .ogg
  sfx-game-win.mp3 / .ogg
  sfx-game-lose.mp3 / .ogg
```

---

## Music

Background music loops for different game states. Music should be lo-fi, chiptune-style, and non-distracting to support focus on gameplay.

### Specifications

| Property | Value |
|----------|-------|
| **Format** | MP3 + OGG |
| **Sample Rate** | 44.1 kHz |
| **Channels** | Stereo |
| **Loudness** | Normalize to –18dBFS (background level, lower than SFX) |
| **Style** | Lo-fi chiptune, 8-bit/16-bit SNES aesthetic |

### Music Tracks

#### 1. Gameplay Loop
| Property | Value |
|----------|-------|
| **Duration** | 30–60 seconds, seamless loop |
| **Tempo** | Moderate (100–120 BPM) |
| **Mood** | Calm, focused, slightly whimsical |
| **Instrumentation** | Chiptune synths, subtle percussion, ambient pads |
| **Key Theme** | Magical fairy garden, light and airy |
| **File Name** | `music-gameplay.mp3 / .ogg` |

**Design Notes:**
- Should not pull focus from card placement and decision-making
- Subtle variation across loops to avoid fatigue (slight pad swell, rhythm variation)
- No sudden loud accents or jumps
- Ideal for 60–90 minute play session background

#### 2. Lobby/Menu Loop
| Property | Value |
|----------|-------|
| **Duration** | 15–30 seconds, seamless loop |
| **Tempo** | Slightly relaxed (90–110 BPM) |
| **Mood** | Welcoming, lighter, inviting |
| **Instrumentation** | Chiptune melodies, simpler drums, bright synths |
| **Key Theme** | Pixie introduction, discovery, playful |
| **File Name** | `music-lobby.mp3 / .ogg` |

**Design Notes:**
- Shorter loop—players spend less time in lobby
- Brighter, more upbeat than gameplay music
- Should feel welcoming and set the tone for the game
- Consider a short "intro" section (first 2–3 seconds) before loop begins

### Implementation Notes

- Both MP3 and OGG formats for broad browser compatibility
- Test loop point to ensure seamless transition (no clicks, gaps, or artifacts)
- Volume should be 10–15dB below sound effects (background presence)
- Use `<audio loop>` tag or Web Audio API with cross-fade for seamless replay
- Provide mute/volume controls in UI for accessibility

**File Location:**
```
frontend/public/assets/music/
  music-gameplay.mp3 / .ogg
  music-lobby.mp3 / .ogg
```

---

## Directory Structure

Complete asset organization for reference:

```
frontend/public/assets/
├── cards/
│   ├── card-1.svg (or .png)
│   ├── card-1@2x.png
│   ├── card-2.svg
│   ├── card-2@2x.png
│   ├── ... (cards 3–9)
│   ├── card-9.svg
│   └── card-9@2x.png
├── card-back.svg (or .png)
├── card-back@2x.png
├── bg-texture.svg (or .png)
├── ui/
│   ├── frame-grid.svg
│   ├── divider-center.svg
│   └── panel-border.svg (if modular)
├── sounds/
│   ├── sfx-card-place.mp3
│   ├── sfx-card-place.ogg
│   ├── sfx-card-flip.mp3
│   ├── sfx-card-flip.ogg
│   ├── sfx-card-validate.mp3
│   ├── sfx-card-validate.ogg
│   ├── sfx-turn-start.mp3
│   ├── sfx-turn-start.ogg
│   ├── sfx-last-turn.mp3
│   ├── sfx-last-turn.ogg
│   ├── sfx-round-complete.mp3
│   ├── sfx-round-complete.ogg
│   ├── sfx-game-win.mp3
│   ├── sfx-game-win.ogg
│   ├── sfx-game-lose.mp3
│   └── sfx-game-lose.ogg
└── music/
    ├── music-gameplay.mp3
    ├── music-gameplay.ogg
    ├── music-lobby.mp3
    └── music-lobby.ogg
```

---

## Implementation Checklist

- [ ] Create card art for all 9 card numbers (SVG or PNG)
- [ ] Create 2x retina versions if using PNG
- [ ] Design and implement card back illustration
- [ ] Design background/table texture
- [ ] Create decorative frame/border UI elements
- [ ] Record/synthesize 8 sound effects (card place, flip, validate, turn start, last turn, round complete, win, lose)
- [ ] Export sound effects in MP3 + OGG format
- [ ] Compose/arrange gameplay loop music (30–60s)
- [ ] Compose/arrange lobby loop music (15–30s)
- [ ] Export music in MP3 + OGG format
- [ ] Create frontend asset loading/caching system
- [ ] Implement sound effect playback system (with mute/volume control)
- [ ] Implement music playback system (with fade-in/fade-out)
- [ ] Test all assets on target devices and browsers
- [ ] Optimize file sizes (compress PNG, MP3, OGG)

---

## Notes for Designers & Developers

### Pixel-Art Guidelines
- Horizontal bar with pixelated ornaments at center
- Maintain consistent pixel density (1–2px line weight recommended for 64×64 base size)
- Align to grid when possible—avoid anti-aliasing
- Use a limited color palette per asset (3–6 colors max for readability)
- Test at actual gameplay size (~40×40px) to ensure clarity

### Audio Production
- Keep all audio **non-verbal** (no voice acting or speech)
- Test audio levels on laptop speakers, headphones, and phone speakers
- Ensure 44.1kHz sample rate for web playback compatibility
- Normalize to consistent loudness using standard metering (LUFS)

### Browser Compatibility
- SVG assets: supported in all modern browsers
- PNG assets: use `<img>` with `srcset` for retina support
- Audio: provide both MP3 and OGG formats
- Consider lazy-loading assets (cards loaded on-demand during game)

### Accessibility
- All audio must have visual feedback (no sound-only cues)
- Provide UI option to mute/disable audio
- Ensure sufficient contrast for all visual elements
- Test with colorblind simulators (especially card number distinction)

---

## References

- **Game Rules:** See `PIXIES_OFFICIAL_LLM_GUIDE.md`
- **Frontend Code:** `frontend/src/components/` for integration points
- **Color Definitions:** `frontend/src/index.css` (CSS custom properties)
- **Font:** Pixelify Sans (imported from Google Fonts in `index.css`)
