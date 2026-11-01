# Piksi — Cozy Woodland 8-bit / 16-bit Design

**Date:** 2026-11-01  
**Status:** Implemented in the frontend after user approval of the 17-board sketch (2026-11-01).  
**Deliverable:** Woodland runtime UI/assets and documentation, following `docs/design/piksi-woodland.pen` and `docs/design/exports/`; shared engine, protocol and game actions unchanged. No deployment.
**Scope:** A complete visual replacement for Twilight Arcane, retaining the two-player game, rules, server authority, protocol, screens, and actions.

## 1. Direction and boundaries

A little woodland board game played on a cabin table: cozy Stardew-like pixel-art atmosphere, honey-colored timber, cream parchment, forest shadows, and friendly woodland animals. Use original supplied artwork, not copied Stardew assets. Replace violet glass, painterly pixies, smooth rounded pills, translucent blur, bloom, and smooth gradients with opaque wooden panels, notched corners, hard-edged pixel shading, and clear paper reading surfaces.

- Four-pixel design grid; 2 px details where needed. Panels have 4 px stepped/notched corners, a 2 px dark outline, a 2–4 px light inner edge, and a hard 4 px downward shadow. Cards use smaller 2 px corner steps. Avoid smooth border radii and blurred shadows.
- Wood is CSS-authored chrome: solid mid-wood base, sparse horizontal 1–2 px grain lines, slightly offset plank seams every 24–40 px, and hard light/dark edges. Keep grain out of text wells; no additional texture image is required. Do not turn every control into an elaborate illustration.
- Parchment is opaque and flat, with an optional solid darker edge, not distressed noise. All longer text, inputs, score tables, and card metadata use parchment and dark ink.
- Background is scenic, subdued by a forest-dark overlay; it carries no required information. Panels remain opaque. Use `image-rendering: pixelated` on supplied pixel artwork, including cards, logo, and backgrounds; preserve source pixels and avoid filters/blur. Use integer dimensions/positions where practical and `contain` for transparent animals. Never force `image-rendering` onto text.
- Animal identity follows **number**, not suit: 1 field mouse, 2 frog, 3 hedgehog, 4 squirrel, 5 rabbit, 6 badger, 7 red fox, 8 owl, 9 stag. Animals do not create new suit names or game mechanics.
- Preserve current action button labels, accessible card/board/dialog semantics, rules mechanics, numbers, scoring symbols, and suit names (`BLUE`, `GREEN`, `YELLOW`, `RED`, `ALL`). Do not silently rewrite rules or label suits “water/leaf/sun/fire.” Retain the **PIKSI** wordmark, tagline **“A little magic for two,”** and cozy magic phrasing (“Three rounds of magic,” “Count your magic,” “The magic adds up,” “Three rounds of woodland magic, beautifully played.”). Replace remaining “pixie(s)” UI/meta copy at implementation according to this audited inventory (do **not** edit runtime `frontend/` files during the sketch phase):

| Source location | Current value | Woodland replacement | Kind |
| --- | --- | --- | --- |
| `frontend/src/components/Lobby.tsx:70` | `Gather your pixies` | `Gather your woodland friends` | Visible `<h2>` lobby heading (wraps on mobile) |
| `frontend/src/components/GameBoard.tsx:107` | `Choose a pixie` | `Choose an animal` | Visible `<h2>` shared-display heading |
| `frontend/src/components/ChooseKeepModal.tsx:31` | `A matching pixie` | `A matching animal` | Visible `<p>` modal eyebrow |
| `frontend/src/components/Rules.tsx:43` | `Gather your pixies` | `Gather your woodland friends` | Visible `<h3>` rules section heading |
| `frontend/index.html:7` | `Gather pixies and share a little magic in this two-player card game.` | `Gather woodland animals and share a little magic in this two-player card game.` | HTML `<meta name="description">` |
| `frontend/public/manifest.webmanifest:4` | `A cozy two-player pixie card game.` | `A cozy two-player woodland animal card game.` | Web app manifest `description` |
| `frontend/src/components/Card.tsx:30` | `` `/assets/cards/pixie-${card.number}.webp` `` | `` `/assets/cards/animal-${card.number}.webp` `` | Non-copy card sprite path |

### Typography decision

Use **Pixelify Sans** (weights 400, 600, 700, `monospace` fallback) for prose UI, headings, buttons, guidance, and suit words, paired with **Press Start 2P** (`--font-numeral`; Google Fonts, SIL Open Font License 1.1 — specimen: `https://fonts.google.com/specimen/Press+Start+2P`, license: `https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/OFL.txt`) for **numerals and codes only**: card numbers, empty-slot numbers, scoring symbol counts, player/round/final scores and round previews, `R1`/`R2`/`R3` headers, the numbers inside `Round / Turn / Pick` metadata, the `N` in `Round N complete`, the color-zone multiplier (`× 3`), and four-letter room codes. Remove Outfit at implementation.

**Press Start 2P constraints:** the family ships a single weight, **400**. Never request or simulate 600/700 (no synthetic bold, no `font-weight` above 400 on `--font-numeral`). Use only 8 px multiples so the 8 × 8 glyph grid lands on whole pixels: **16 px** for counts, scores, totals, previews, `R1`–`R3`, metadata spans, mobile card/slot numerals and the room-code input; **24 px** for desktop card/slot numerals (and the `Round N complete` numeral, desktop final totals); **32 px** for the waiting-room room-code plaque. No 12, 14, 18, 20, 22, or 26 px numerals. Never compress it horizontally (no negative letter-spacing, no `font-stretch`, no `scaleX`). If 16 px numeric data does not fit, enlarge the card or layout and let the page or dialog scroll; never shrink below 16 px.

**Numeral legibility rationale (user decision, verified at native 1× raster scale):** the user's real-Chromium comparison showed that Pixelify Sans prose is fine, but its numerals collide with letters: `5`/`S`, `2`/`Z`, and `8`/`B` share silhouettes (`54 50` reads as `S4 S0`; `+5` reads as `+S`; see `docs/design/exports/Test-Numerals-1x-Pixelify-Sans.png`, `1281 × 683 px`). Press Start 2P draws each of `5`/`S`, `8`/`B`, `2`/`Z`, `6`/`G` distinctly and is the canonical 8-bit arcade numeral face, matching the pixel woodland direction. The native Pencil render `docs/design/exports/Test-Numerals-1x-Press-Start-2P.png` (`1280 × 789 px`, exported at scale 1 with a 1 px tick ruler) shows `0123456789`, `S5 5S B8 8B Z2 2Z G6 6G`, `54 50`, `+5`, `ABCD`, and the full `Round 2 / 3 · Turn 4 · Pick 1 / 4` string at 16, 24, and 32 px, weight 400, all unambiguous.

**Mixed metadata strategy (all phases, mobile and desktop):** `Round 2 / 3 · Turn 4 · Pick 1 / 4` renders as Pixelify Sans words and separators (`Round`, `/`, `· Turn`, `· Pick`; 12 px mobile, 14 px desktop, weight 600) with Press Start 2P 16 px numeric spans. A whole-line Press Start 2P string at 16 px needs about 528 px and cannot share the 366 px mobile signboard with `PIKSI`, so the mixed strategy is used everywhere for consistency. Numbers inside running prose (rules text, explanations such as “Your 1 is already validated”) stay in Pixelify Sans as reading text.

| Role | Mobile | Desktop | Font & notes |
| --- | --- | --- | --- |
| Wordmark | 48 px / 1 | 72 px / 1 | `--font-ui` (`Pixelify Sans` 700), solid cream with hard dark offset |
| Screen title | 28 px / 1.15 | 32 px / 1.15 | `--font-ui` 700 (`Round N complete` sets `N` in `--font-numeral` 24 px) |
| Panel title | 18 px / 1.15 | 22 px / 1.15 | `--font-ui` 700 |
| Body / rules | 16 px / 1.5 | 16 px / 1.5 | `--font-ui` 400; no letterspacing |
| Buttons / name input | 16 px / 1.2 | 16 px / 1.2 | `--font-ui` 600 or 700 |
| Supporting metadata | 12 px / 1.25 | 14 px / 1.25 | `--font-ui` 600 words; numbers in `Round / Turn / Pick` are `--font-numeral` 16 px spans; never 8–10 px |
| Card suit footer | 12 px / 1 | 12–14 px / 1 | `--font-ui` 600–700 (`BLUE`/`GREEN`/`YELLOW`/`RED`/`ALL`); no compressed tracking |
| Card symbol count | 16 px / 1 | 16 px / 1 | `--font-numeral` 400 (`Press Start 2P`); ink on cream beside the scoring glyph |
| Card & empty-slot numeral | 16 px / 1 | 24 px / 1 | `--font-numeral` 400; dark/muted ink on cream. Mobile dialogs (112 px keep cards) also use 16 px |
| Scores, previews, `R1`–`R3`, room-code input | 16 px / 1.05 | 16 px / 1.05 (24 px desktop final totals) | `--font-numeral` 400 |
| Room-code plaque | 32 px / 1 | 32 px / 1 | `--font-numeral` 400 (`ABCD`), never bold |
At text zoom, allow wrapping and document/dialog scrolling instead of shrinking type. Small pixel font does not excuse illegible instructions.

## 2. Complete visual token contract

Values below are the implemented design tokens in `frontend/src/index.css`. Existing suit variable names are retained because they represent game data. Obsolete theme tokens and their consumers have been removed; there is one visual system.

### Color tokens

| CSS custom property | Value | Role / required pairing |
| --- | --- | --- |
| `--color-bg` | `#1C2C24` | Forest-dark fallback behind landscape |
| `--color-bg-card` | `#F7E8C6` | Card paper |
| `--color-bg-surface` | `#EBD5A7` | Raised paper wells / score total strip |
| `--color-wood-light` | `#D7A66B` | Top plank edge and fine grain |
| `--color-wood-mid` | `#A16B3B` | Main timber frame; not a small-text background |
| `--color-wood-dark` | `#51341F` | Frame shadow, dark signboards |
| `--color-parchment` | `#F7E8C6` | Opaque text areas and inputs |
| `--color-parchment-deep` | `#EBD5A7` | Inset rows / disabled button fill |
| `--color-text` | `#281C15` | Primary ink on paper/light controls |
| `--color-text-muted` | `#66503D` | Secondary ink on paper only |
| `--color-text-inverse` | `#FFF8E7` | Text on dark-wood/forest surfaces |
| `--color-text-inverse-muted` | `#EBD5A7` | Secondary copy on dark wood only |
| `--color-accent` | `#D59B55` | Honey primary button / decorative brand accent |
| `--color-accent-pressed` | `#BD8242` | Depressed primary fill |
| `--color-highlight` | `#FFFDF4` | Neutral ivory selectable/validated marker; never a suit |
| `--color-highlight-ink` | `#281C15` | Dark separator beneath ivory state outline |
| `--color-focus` | `#693E91` | Purple keyboard-focus ring, separated from all suits |
| `--color-focus-outer` | `#FFFDF4` | Outer ring when focus is on a dark background |
| `--color-danger` | `#982F35` | Error text/icon and frame, not the red suit |
| `--color-danger-surface` | `#F7DAD0` | Opaque error parchment |
| `--color-blue` | `#385C83` | Blue suit: deep river blue |
| `--color-green` | `#5F7945` | Green suit: moss |
| `--color-yellow` | `#E5BA55` | Yellow suit: wheat |
| `--color-red` | `#B9684B` | Red suit: terracotta |
| `--color-border` | `#51341F` | Structural outline / paper separators |
| `--color-shadow` | `#201810` | Hard offset shadows |
| `--color-overlay` | `rgb(28 44 36 / 0.78)` | Modal backdrop; no backdrop blur |
| `--color-bg-wash` | `rgb(28 44 36 / 0.36)` | Background art wash, behind opaque chrome |

### Geometry and type tokens

| CSS custom property | Value | Role |
| --- | --- | --- |
| `--font-ui` | `"Pixelify Sans", monospace` | Prose UI, headings, buttons, guidance, suit words |
| `--font-numeral` | `"Press Start 2P", monospace` | Card/slot numbers, symbol counts, scores/previews/totals, `R1`–`R3`, round/turn/pick numbers, `Round N` numeral, zone multiplier, room codes; weight 400 only, 16/24/32 px only |
| `--space-unit` | `4px` | Main spacing grid |
| `--pixel-edge` | `2px` | Structural stroke |
| `--pixel-step` | `4px` | Panel corner notch |
| `--pixel-shadow-offset` | `4px` | Hard downward bevel/shadow |
| `--focus-width` | `3px` | Focus outline |
| `--focus-offset` | `3px` | Space outside control |
| `--target-min` | `44px` | Minimum interactive target in either axis |
| `--card-ratio` | `5 / 7` | Face, back, empty, pending, modal |
| `--motion-press` | `80ms` | Optional brief mechanical press; zero with reduced motion |

### Suit recognition and state separation

The suit luminances are approximately blue 0.101, green 0.165, red 0.207, yellow 0.524: blue is darkest and wheat brightest, with distinct hues between. These values alone do **not** guarantee separation under color-vision deficiencies, especially green/red. Color must never be the only identifier.

**Current-code audit:** `Card.tsx` already prints BLUE/GREEN/YELLOW/RED or ALL and has a full accessible description. It does **not** have distinct suit glyphs or patterns. `SymbolIcon.tsx` contains spiral, cross, and special spiral only; these encode scoring, not suits. Do not claim an existing four-suit icon language or repurpose scoring symbols.

Retain the printed suit names and add a small CSS pixel pattern band inside the frame as redundant recognition:

| Suit | Pattern band | Printed footer |
| --- | --- | --- |
| Blue | Repeated paired horizontal bars | BLUE |
| Green | Repeated vertical dashes | GREEN |
| Yellow | Repeated 2 × 2 square dots | YELLOW |
| Red | Repeated stepped diagonal strokes | RED |
| Multicolor | Four hard-edged segments, each with its own band | ALL |

Patterns are restrained frame decoration, never behind metadata or animal faces. They must remain distinguishable in monochrome. Use dark outline around wheat, which otherwise has low contrast on cream. Numbers, labels, and ordinary scoring symbols remain ink rather than being low-contrast suit-colored text. Special spiral keeps its scoring glyph **and** color treatment; its suit footer supplies the matching color name in the current deck. Show this correspondence explicitly in the rules/component legend (for example, a blue special card with BLUE printed beneath it).

**Highlight ≠ suit:** neutral ivory outside a dark separator plus square corner brackets indicates an actionable card/slot. Validated uses a neutral ivory square check badge. Never use red, green, wheat, or the honey primary-button fill as the sole selected/validated indicator. Purple is reserved for keyboard focus; hover and validation do not turn the suit frame purple. Preserve the suit band under every overlay.

## 3. Audited screen and state inventory

Sources: `frontend/src/App.tsx`, every file in `frontend/src/components/`, `frontend/src/index.css`, `frontend/src/store/game-store.ts`, `shared/types.ts`, `shared/protocol.ts`, and real card definitions in `shared/deck.ts`. Existing design context: `docs/asset-guide.md`, `frontend/README.md`, and the 2026-06-13 Twilight Arcane spec. These describe the current implementation, not a verified browser session.

| Screen / visible state | Current behavior and required information |
| --- | --- |
| Lobby: idle create/join | Logo, PIKSI, tagline, welcome/title, saved name input (16-character limit), Create a game, divider, four-character uppercase room-code input, Join game, footer. Create and join are on one screen, not separate routes. |
| Lobby: invite landing | `?room=ABCD` pre-fills the code; name is still needed. No automatic join or new welcome wizard. |
| Lobby: disabled / connecting | Create/join depend on connected status and valid input. Connecting…/Disconnected chip remains visible. |
| Lobby: creating / joining | Existing button labels “Creating game…” / “Joining…”; keep entered values and existing disabling behavior. |
| Lobby: waiting | “Waiting for a friend,” four-letter room code, explanation, Copy invite link, waiting status. Link is copied, not a visible editable URL field. |
| Lobby: copied | “Invite link copied” for 2.5 seconds, then original button label. Clipboard failure currently leaves original label; no invented success toast. |
| Game: choose_card / my turn | Round 1–3, turn number, pick 1–4, guidance, opponent board, shared display, own board; only shared cards are pickable. Display can contain 1–4 cards. |
| Game: choose_card / opponent turn | Same layout and known cards; waiting guidance; shared cards are not buttons. |
| Game: choose_keep / my turn | Required modal with existing and just-picked card, “Keep existing” and “Keep new.” Other card goes beneath; no cancel/close action. |
| Game: choose_keep / opponent turn | No choice modal; banner says opponent is choosing a card to keep. |
| Game: choose_space / my turn | Pending-card illustration replaces shared display. Explain that its number is already validated. Only empty spaces on own grid are highlighted/actionable. |
| Game: choose_space / opponent turn | Opponent placement guidance; own spaces not actionable. Do not reveal a private pending card in a new UI. |
| Game: final pick | `lastTurnTriggered` adds “Final pick” to guidance; retain as text badge, not just a color flash. |
| Game: empty shared display | “No cards in the display”; do not synthesize cards. |
| Game: round complete / scoring | Banner says “Round complete”; score dialog appears immediately over board. There is **no separate timed reveal screen** and no client reveal animation phase. |
| Round score breakdown | Player columns; Validated, Symbols, Largest color zone with explanatory detail and round multiplier; Round total and Overall total. R1/R2: Continue to next round. R3: See final results. No extra “both ready” state exists here. |
| Game over: own win / opponent win / tie | Distinct title, brand badge, two-player R1/R2/R3/Total table; no invented prize or ranking. |
| Game over: rematch idle | “Ready for another game?” and Play again. |
| Game over: own request pending | “Waiting for [friend]…”; disabled “Rematch requested”; scores remain visible. |
| Game over: opponent request pending | “[friend] wants a rematch — Play again?”; own Play again remains available if connected. Both requests restart automatically; no extra confirmation screen. |
| Rules | Global How to play opens field-guide dialog from lobby, game, or results; all rule sections, scoring legend, close × and Back to game. Escape/backdrop closes; focus returns to opener. |
| Connection: connected / connecting / disconnected | Persistent labeled chip on every screen; game banner changes to “Connection lost — reconnecting…” when local connection is unavailable. Retain known board data. |
| Connection: opponent reconnecting | While locally connected, game banner says “[name] is reconnecting…”. No fabricated countdown or new pause rules. |
| Connection: resumed | Existing session restores room/game and rematch request state; no separate success screen. Reload initially may show lobby plus Connecting… while awaiting state. |
| Resume rejected / room abandoned | Store clears room/game and returns to lobby with server-provided error. |
| Error | Global five-second `role=alert` toast, including create/join/action/server errors. Creating/joining errors return controls to idle. No added retry or dismiss button in this visual pass. |

Important constraints: current card selection is gated by local connectivity, not additionally by opponent connectivity. Round continuation and rematch are disabled while locally disconnected; a requested rematch is also disabled. Do not change action gating in a cosmetic redesign. Protocol exposes filtered state, not deck contents or hidden opponent cards; do not draw hidden card identities. Scores and round preview remain server/shared-engine-derived, never animal-derived.

### Card and board-space variants

- Face-up blue, green, yellow, red: same anatomy, number-to-animal mapping, distinct suit frame/band/footer.
- Multicolor: hard-segment four-suit frame and ALL label; not a smooth rainbow gradient and not a selectable-state border.
- Ordinary scoring: spiral plus count, cross plus count; omit a kind with zero count. Do not repeat six tiny icons instead of the existing icon/count convention.
- Special spiral: spiral-plus-dot glyph, suit cue, no invented numeric count; animal and number remain visible. Must differ from an ordinary spiral.
- `EMPTY`: recessed numbered slot, no animal.
- `FACEDOWN_ONLY`: identical non-identifying back for all cards; do not put the hidden card number or animal on the back.
- `FACEUP_ONLY`: normal face; no validation badge.
- `VALIDATED`: visible top face with square check badge indicating a hidden supporting card; bottom identity stays hidden. Do not add a second selectable face or expose bottom-card data.
- Highlighted empty slot: ivory corner brackets/dark outline and a readable space number; actual button only on valid own targets.
- Selectable shared face: consistent neutral action brackets on hover/focus and a readable “Choose one” instruction; non-selectable opponent/display cards lack hover lift and pointer affordances.
- Pending and keep-choice cards reuse the same face/back geometry, not separate card art conventions.

## 4. Component specifications

### Card face

5:7 throughout. Outer dark pixel outline; 2–4 px suit-tinted inner frame/pattern band; parchment interior. Top-left numeral on a cream backing, centered transparent animal below; protected bottom metadata area with a **horizontal symbol/count row** and printed suit name beneath. Current symbol stack may move into this row without changing meaning. Number, animal, symbols, and footer must not overlap. Use the animal art as decoration (`alt=""`); accessible card descriptions still convey number, colors, spirals, crosses, and special spiral exactly as now.

Desktop board faces: 120 × 168 px; display 100 × 140 px; keep dialog and pending card 120 px. Mobile own/display/pending faces: 60 × 84 px; opponent faces: **55 × 77 px** (enlarged from the former compact 48 px so a 16 px Press Start 2P numeral, a scoring glyph plus 16 px count, and a 12 px `YELLOW` footer fit without overlap); mobile keep dialog 112 px. Preserve 5:7 with integer sizes where possible. Never shrink Press Start 2P below 16 px or squeeze it horizontally to fit a card; enlarge the card and let the page scroll instead. No labels below 12 px. Use BLUE/GREEN/YELLOW/RED/ALL without tracking. Let the sketch expose crowding honestly; never place text atop busy art to fit. Extra-small viewports may scroll rather than scale cards under these sizes.

### Back, empty slot, highlight

Back: `/assets/cards/back.webp`, full 5:7 image with dark outline, `cover` only if source ratio matches; no generated number overlay. Empty: deep parchment inset well, stepped dashed/notched wood edge, centered muted `--font-numeral` number (16 px mobile, 24 px desktop). Actionable empty: ivory brackets outside 2 px dark separator; numeral becomes ink/full opacity. Validated check: 16 px mobile / 20 px desktop square with stepped corners, ivory fill and ink check; neutral, not green. Leave space so badge/focus isn't clipped by the cell or panel.

### Buttons and form fields

Chunky Stardew-style bevel, not glass: 2 px wood-dark outline, light top/left edge, hard 4 px bottom lip, 4 px notches. Primary honey fill and ink label; secondary cream fill and ink label. Hover changes the hard inner edge, not a glow. Pressed moves content down 2 px and shortens lip by 2 px without reflowing neighbors. Disabled uses deep parchment, muted ink, flat/reduced lip, no hover/press; do not lower opacity for the whole control and lose label contrast. All button action labels remain verbatim (the four visible `pixie` headings/eyebrow migrate per §1). Inputs are cream inset wells, explicit labels, minimum 44 px height, visible focus; placeholder is not a replacement for the label. Room-code inputs and placeholders use `--font-numeral`.

### Panels and dialogs

Wood frame around parchment content. Dark-wood headers may use inverse cream text. Keep field guides/table text on paper. At desktop use 20–24 px interior padding; mobile 12–16 px. Dialog max height viewport minus safe margins, internal vertical scrolling; opaque panel on forest-dark overlay. Required choose-keep and score dialogs have no invented dismissal. Rules alone has its existing close controls. Frame and shadow should not clip focus outlines. No backdrop blur.

### Status/header and score table

A compact wooden signboard holds PIKSI, round/turn/pick and tools without overlap. Status is a paper strip beneath with literal guidance. “Your turn” uses neutral bracket/check-style cue, not a suit-tinted panel. Connection chip has labeled square signal light and text, never dot-only; connected/connecting/disconnected are understood from copy, not suit color. On phones tools occupy a dedicated top row instead of squeezing header text behind fixed chips.

Keep score table columns and labels: two players for breakdown; name/R1/R2/R3/Total for final results. Dark ink on paper, 2 px ruled separators, bold totals on deep-parchment strip. Right/center-align numeric columns consistently. Round and cumulative totals remain distinct. Names up to 16 characters wrap where needed; do not make a whole player identity unreadable via ellipsis just to preserve a one-line row. Negative numbers and zero must be visible. Player identities use “you”/“their” copy, not blue/red as the sole differentiator.

### Room code and errors

Room code: cream inset plaque within wooden waiting panel, four separate-looking but continuous readable letters in `--font-numeral` 32 px, weight 400 (Press Start 2P has no bold), generous tracking, ROOM CODE label 12 px. Copy invite link is a full-width primary button; do not imply code-copy is a separate action. Error toast: pale danger paper with dark danger edge/icon and full server message; 16 px text, wraps, max width viewport minus 24 px, placed below global tools without covering a dialog's main action. Retain alert semantics and existing duration. Copied invite feedback stays in the button, not an additional toast.

## 5. Responsive layouts

### Mobile portrait — 390 × 844

12 px outer gutters, 366 px usable width. Keep the current content order: opponent woodland → gathering/display → own woodland. Reserve a 44 px top tools row and a separate roughly 32 px round/turn/pick row; guidance gets at least 40 px and wraps. Compact board headings combine name/“you” and score on one row; optional decorative eyebrow can be omitted on compact game boards, but not scores or guidance.

Use a centered 3 × 3 opponent grid with 55 × 77 px cards (173 × 239 px with 4 px gaps), own grid with 60 × 84 px cards (188 × 260 px), and 1–4 display cards in one row at 60 px (four need 288 px with 12 px gaps). Panels use 4–8 px interior padding inside a 3 px wooden rim; compact headings at 12 px minimum and previews/totals in 16 px `--font-numeral`. Target all three areas within or near the 844 px viewport using compact chrome, not small text. **If the combined measured height exceeds available space, allow vertical page scrolling**; never retain `overflow: hidden` and cut off the own board. Do not add tabs/collapsed opponent boards or change grid numbering. At text zoom/short screens, all cards, instructions, and actions remain reachable by scrolling. In the choose-space phase the two-line guidance plus `Final pick` badge costs about 18 px, so the pending card sits left of a column holding the `Choose an animal` heading and the explanation; this keeps the own board inside 844 px.

Lobby: emblem 72 px, wordmark 48 px, 366 px maximum panel width, name then primary create, divider then code+join row. Keep inputs/action 44 px tall. Waiting reuses same panel width. End screen uses compact badge and score table without horizontal overflow. Dialogs 366 px wide maximum with 12 px side clearance; choose-keep remains two columns, each 112 px face plus its full action button. Rules scroll internally with Back to game reachable; preserve a 44 px close target. Round table uses flexible label column and two approximately 52 px number columns; descriptions wrap in label column.

### Desktop — 1440 × 900

Center the game within approximately 1360 px, 24–32 px outer gutters. Tools and game header can share the top signboard with explicit reserved space, then full-width guidance. Three columns: opponent board (~430 px), gathering (~330 px), own board (~430 px), 16–24 px gaps. Boards use 112–120 px faces and 8 px cell gaps; display can use 2 × 2 faces to breathe. Panels align around the board's middle, with both names, totals, and round previews visible. Avoid giant empty chrome while keeping landscape visible around panels.

Lobby/waiting: centered brand above 440 px panel; do not invent sidebars. Results: approximately 520 px paper score panel. Choose-keep: ~520 px, two 120 px faces. Breakdown: ~560 px for readable details. Rules: ~640 px, maximum 840 px high with internal scroll. Modal backdrop retains recognizable but subdued board/lobby behind it.

Layout changes above only improve readability/reachability: no new actions, phase, pause, countdown, confirmation, deck count, turn timer, or private information.

## 6. Asset contract

Artwork is complete and user-reviewed at `/tmp/piksi-woodland-art/final/`. The portable sketch preserves source subpaths under `docs/design/assets/`; implementation copies its nested `assets/` and `icons/` trees into `frontend/public/`. The runtime manifest records the original generation prompts and post-processing.

| Incoming path relative to `/tmp/piksi-woodland-art/final/` | Expected size | Drawing use / eventual runtime URL |
| --- | --- | --- |
| `assets/bg/woodland.webp` | 2560 × 1440 | Desktop full-board scenic fill, center/cover; `/assets/bg/woodland.webp` |
| `assets/bg/woodland-portrait.webp` | 1080 × 1920 | Mobile full-board scenic fill, center/cover; `/assets/bg/woodland-portrait.webp` |
| `assets/brand/logo.webp` | Badge; supplied dimensions | Fox + acorn brand badge on lobby/waiting/results and component sheet; `/assets/brand/logo.webp` |
| `assets/cards/back.webp` | 720 × 1008 | Every face-down example, no animal identity; `/assets/cards/back.webp` |
| `assets/cards/animal-1.webp` | 768 × 768 transparent | Field mouse, every number 1 face |
| `assets/cards/animal-2.webp` | 768 × 768 transparent | Frog, every number 2 face |
| `assets/cards/animal-3.webp` | 768 × 768 transparent | Hedgehog, every number 3 face |
| `assets/cards/animal-4.webp` | 768 × 768 transparent | Squirrel, every number 4 face |
| `assets/cards/animal-5.webp` | 768 × 768 transparent | Rabbit, every number 5 face |
| `assets/cards/animal-6.webp` | 768 × 768 transparent | Badger, every number 6 face |
| `assets/cards/animal-7.webp` | 768 × 768 transparent | Red fox, every number 7 face |
| `assets/cards/animal-8.webp` | 768 × 768 transparent | Owl, every number 8 face |
| `assets/cards/animal-9.webp` | 768 × 768 transparent | Stag, every number 9 face |
| `icons/icon-192.png` | 192 × 192 | Installed-app icon preview on component sheet |
| `icons/icon-512.png` | 512 × 512 | Installed-app icon preview on component sheet |
| `icons/icon-maskable-512.png` | 512 × 512 | Maskable preview with safe-area guide on component sheet |
| `icons/apple-touch-icon.png` | 180 × 180 | Apple icon preview on component sheet |

All animal runtime URLs are `/assets/cards/animal-N.webp`. Implementation removes the obsolete numbered sprites and previous background assets/references, and updates asset documentation and web app metadata. Icons are app chrome, not scoring/suit symbols.

## 7. Accessibility contract

- WCAG AA: at least 4.5:1 for all normal text and 3:1 for large text; at least 3:1 for meaningful control boundaries/state indicators. Do not lower targets because the font is pixel-like.
- Calculated sRGB contrast for proposed flat tokens: ink/paper **13.66:1**; muted ink/paper **6.23:1**; inverse cream/dark wood **10.66:1**; ink/primary honey **6.83:1**; purple focus/paper **6.42:1**; danger/pale danger paper **5.69:1**. These are token-pair calculations, not a rendered UI accessibility audit. Other combinations need review in the sketch/implementation; do not use wood-mid behind small text.
- Visible focus on every action/input: 3 px purple outline, 3 px offset, plus ivory outer keyline against dark surroundings. Keyboard focus is distinct from selection and validation. Never crop it with stepped-corner clipping.
- Preserve existing card accessible labels, grid/section labels, dialog names/descriptions, `role=status`, polite turn/rematch announcements, and `role=alert`. Decorative animals/background/logo remain silent. Maintain real buttons only for real actions.
- Existing modal focus behavior is contractual: keep dialog tab trapping; choose-keep initial focus on Keep existing; score initial focus on Continue/See final results; rules initial close focus and return to opener. Do not imply Escape dismisses required gameplay dialogs.
- Minimum 44 × 44 px targets including rules/close controls; no hover-only instruction. Distinguish suits through printed words and pattern bands, not merely hue. Validate the four-card and special-spiral examples in grayscale and protan/deutan simulation during sketch review.
- Reduced motion removes card-arrival scaling, hover lift, blinking, and press transitions. Static hard state outlines remain. No continuous sparkle/particle layer or new celebration animation is required.
- At 200% text zoom, page/modal content scrolls and labels wrap; no hidden actions, horizontal page overflow, or clipped table totals.

## 8. Precise Pencil drawing brief

**Completed sketch brief (historical):** the user-approved 17-board sketch below is implemented in the frontend. The exported boards remain the visual target.

Create a cohesive editable pen.dev sketch, not screenshots pasted as entire screens. Use the supplied art only for backgrounds, animals, badge, back, and icons; keep frames, controls, text, score tables, and patterns as editable layers/components. Use `Pixelify Sans` (`--font-ui`) for UI copy and `Press Start 2P` (`--font-numeral`, weight 400, 16/24/32 px) for card/slot numbers, symbol counts, scores, round/turn/pick numbers, and room codes. Board names and sizes below are exact. For every paired scene, create both `M-…` at **390 × 844** and `D-…` at **1440 × 900**. Reuse shared components/instances rather than independently redesigning each board.

### Board manifest

| Pair stem (prefix M- and D-) | Required content / differences |
| --- | --- |
| `01-Lobby-Create-Join` | Default form, logo, all tools; name filled and code empty so Join is disabled. |
| `03-Waiting-Invite` | ABCD plaque, copy action, waiting message. Include copied-button variant adjacent as a component annotation, not a new action. |
| `04-Game-My-Turn` | Four real display cards; both 3 × 3 grids; empty, face-up, face-down, and validated examples; round/turn/pick, totals, previews. Own selectable display face shown with focus. |
| `06-Game-Choose-Space` | Pending card and explanation in gathering; own empty target brackets; non-target cards unchanged. Final-pick text badge visible. |
| `07-Game-Choose-Keep` | Real board backdrop; matching-number existing/new faces; both action labels; required-dialog styling and no close icon. |
| `08-Round-Score` | Board backdrop plus complete R2 score table; validated/symbols/zone detail, totals, Continue action. Add R3 title/multiplier/See final results variant in annotations. This is also the round-reveal treatment; do not add a fictitious standalone reveal. |
| `09-Final-Results` | Own-win title, emblem, complete three-round table, Play again. Show opponent-win and tie titles as named variants. |

Mobile-only board: **`M-11-Rules-Field-Guide` — 390 × 844**, full existing rules and three scoring-symbol legend entries; scrollable mobile viewport with an adjacent continuation region showing the remaining text at readable size. Include the suit/pattern key without rewriting rules. There is no desktop rules board in this sketch.

Represent invite-prefilled join, empty-name/disabled/loading controls, copied invite, opponent turn/keep/placement, own/opponent rematch pending, local/opponent connection recovery, return-to-lobby errors and action-error toasts as small labeled variant strips on C-01 or beside their closest scene, not full boards. Preserve the distinctions audited in §3.

Additional exact boards:

- **`C-01-Tokens-Components` — 1600 × 1600:** all color/type/geometry tokens labeled by variable + value; wood/plank/notch construction; primary/secondary/disabled/pressed/hover/focus buttons; inputs; room-code chip; connected/connecting/disconnected chips; error; score strip; empty/highlighted/face-down/validated states. Show 55 px, 60 px, and 120 px card widths at native scale, plus a focus ring outside a suit frame. Include grayscale suit band samples and all four app icon previews.
- **`C-02-Animal-Card-Catalog` — 1600 × 1200:** nine numbered animal faces, four distinct suit examples, multicolor, ordinary spiral/count, cross/count, and special spiral variants. Use actual deck exemplars below; no invalid invented numbers/symbol combinations. Include labeled animal-to-number mapping and neutral state-vs-suit comparison.

This is **17 boards total**: seven paired scenes (14), one mobile rules scene, and two component boards. Annotation/continuation regions are not additional full scene boards. Mobile and desktop scenes must be genuine responsive compositions, not one uniformly scaled image.

### Portable output and Pencil workflow

- Pen file: `docs/design/piksi-woodland.pen`.
- Copy all supplied art into `docs/design/assets/`, retaining the source sub-paths: `assets/bg`, `assets/brand`, `assets/cards`, and `icons`. Thus an animal reference from the pen file is `assets/assets/cards/animal-1.webp`; icons use `assets/icons/...`. No `/tmp` or absolute asset references.
- Export every board to `docs/design/exports/<exact-board-name>.png`; rename hash-named exports.
- Write `docs/design/README.md` with board index, opening instructions, variant/continuation locations, and legibility/rendering issues.
- Art has been completed and user-reviewed in `/tmp/piksi-woodland-art/final/`; the logo is 1024 × 1024 transparent and animals are binary-alpha pixel sprites.
- Desktop binary is `~/.local/opt/pen/current/pen`; launch it if `get_app_state` cannot connect. Desktop canvas does not auto-save: use `pen interactive --in ~/.pencil/backup/<hash> --out <file.pen>`, then `save()`, and confirm output mtime changed.
- Keep overlays/dividers grouped inside each clipped board frame. Use nearest-neighbor rendering if Pencil supports it; otherwise explicitly document the limitation. The orchestrator must visually open every exported PNG and return corrections before acceptance.

### Art placement and sample data

- Every M scene uses portrait woodland art edge-to-edge; every D scene uses landscape woodland art. Use the dark wash only behind opaque UI; no wallpaper stretching.
- Lobby/waiting/results use the fox-acorn logo. The game header may use text PIKSI only; do not sacrifice phone status space for another large badge.
- Every visible face uses `animal-${number}.webp` with `contain`, including display, pending, modal, and catalog. Every hidden card uses only `back.webp`.
- Use readable sample players **Rowan** (you) and **Hazel**; annotate that real names can reach 16 characters. Waiting code **ABCD** is illustrative, not a live room.
- Canonical component exemplars from `shared/deck.ts`: B1 = blue mouse 1 with spiral 6; G2 = green frog 2 with spiral 3; Y4 = yellow hedgehog 3 with spiral 5; R5 = red squirrel 4 with spiral 2; B9 = blue rabbit 5 with cross 2; M4 = ALL badger 6 with cross 1; Y13 = yellow fox 7 with cross 5; R14 = red owl 8 with cross 5; B15 = blue stag 9 with cross 6. Special samples: B6 = blue squirrel 4 special-blue; G4 = green hedgehog 3 special-green; Y3 = yellow frog 2 special-yellow; R2 = red mouse 1 special-red. Include M1 = ALL frog 2 with no scoring symbol to show empty symbol row.
- Choose-keep can compare B6 and R5 (both number 4, different visible scoring). State-only sketches may share static board compositions; annotate phase and active player. Do not present an impossible private-card reveal or an invented card definition.
- Use internally consistent illustrative score-table data. Example R1/R2/R3: Rowan 24/30/38 = 92, Hazel 22/28/35 = 85; R2 breakdown Rowan validated 14 + symbols 4 + zone 12 = 30, Hazel 15 + symbols 4 + zone 9 = 28; cumulative after R2 is 54 vs 50. Mark these as illustrative rather than asserting they are engine-verified scores for the pictured boards. If drawing a fully numeric game-state fixture, derive previews/totals from the same real fixture instead of guessing.

### Sketch acceptance criteria

1. All 17 named boards exist at specified sizes, including every required annotated variant and the mobile rules continuation. No application code is changed to obtain the sketch.
2. Warm pixel woodland identity is unmistakable on lobby, game, dialogs, scores, rules, errors, and results; no surviving violet-glass chrome, painterly pixie art, blurred glow, smooth rainbow border, or Outfit text.
3. Supplied landscape/portrait, badge, back, all nine animal images and icon previews are placed via portable relative file references; no missing art or temporary placeholder is accepted as final. If assets are unavailable, report that explicit prerequisite rather than faking completion.
4. Cards preserve 5:7; animals, numerals, suit words, scoring symbols/counts remain visible at actual phone scale. Multicolor and special spiral are demonstrated, and all board-space states remain identifiable.
5. Four suits retain exact game names and distinct pattern bands, with grayscale/color-vision review notes. Ivory selection/validation and purple keyboard focus remain visibly different from every suit, particularly yellow.
6. Phone text is readable at 100% native 390 × 844 scale, targets are at least 44 px, four display cards fit, 3 × 3 numbering remains intact, and complete content is reachable by explicitly drawn scrolling where necessary. No fixed tools obscure round/turn/pick.
7. Contrast uses the specified foreground/background pairings; textures/art do not sit behind critical text. Focus outlines and validation badges are not clipped. Include one focused card and one focused form action.
8. Dialogs retain the correct action set and semantic hierarchy; no new cancel/rematch/ready/countdown or reveal behavior is implied. Round totals and cumulative totals, local/opponent reconnect states, and own/opponent rematch requests are distinguishable.
9. Design layers are editable and sensibly named (frame, paper, label, animal, suit-band, numeral, symbols, state); shared components stay consistent between M/D scenes. All annotation-only variants are clearly separate from actual UI.
10. Drawing output includes a short board index and any visual legibility issues requiring review before implementation. This phase does not claim browser, engine, or production verification.

## 9. Open questions and next gate

No blocking design decisions remain. The accepted sketch is implemented with Pixelify Sans prose, Press Start 2P numerals/codes at 16/24/32 px, woodland copy and art, 55 × 77 px mobile opponent cards, and the specified token palette. The app uses CSS nearest-neighbor pixel rendering (unavailable in Pencil); page/dialog scrolling preserves readable sizes. Browser smoke evidence and verification results are reported with the implementation hand-off. No deployment is authorized by this specification.
