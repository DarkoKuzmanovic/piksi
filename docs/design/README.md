# Piksi — Cozy Woodland 8-bit / 16-bit Redesign Sketch (`pen.dev`)

Portable `pen.dev` design sketch implementing [`docs/superpowers/specs/2026-11-01-woodland-8bit-design.md`](../superpowers/specs/2026-11-01-woodland-8bit-design.md). Application code (`frontend/`, `backend/`, `shared/`) is untouched in this design-only phase.

---

## Directory Layout & Portable Assets

```text
docs/design/
├── piksi-woodland.pen                  # Portable pen.dev v2.21 document (encrypted .pen format)
├── README.md                           # Board index, opening instructions, variant map & review notes
├── assets/                             # Local copy of /tmp/piksi-woodland-art/final/ preserving subpaths
│   ├── assets/
│   │   ├── bg/
│   │   │   ├── woodland.webp           # 2560×1440 desktop scenic clearing
│   │   │   └── woodland-portrait.webp  # 1080×1920 mobile portrait clearing
│   │   ├── brand/
│   │   │   └── logo.webp               # 1024×1024 transparent fox + acorn emblem
│   │   └── cards/
│   │       ├── animal-1.webp … animal-9.webp  # 768×768 binary-alpha sprites (1 mouse … 9 stag)
│   │       └── back.webp               # 720×1008 symmetrical 5:7 card back
│   └── icons/
│       ├── apple-touch-icon.png        # 180×180
│       ├── icon-192.png                # 192×192
│       ├── icon-512.png                # 512×512
│       └── icon-maskable-512.png       # 512×512
└── exports/                            # 2× PNG exports (17 boards + 6 strips) + 2 native 1× numeral test PNGs
```

All image fills inside `piksi-woodland.pen` use portable paths relative to `docs/design/piksi-woodland.pen` (`assets/assets/bg/...`, `assets/assets/brand/...`, `assets/assets/cards/...`, and `assets/icons/...`). Zero `/tmp`, absolute, or remote URLs are used.

---

## How to Open & Save `piksi-woodland.pen`

> **Important:** `.pen` files use Pencil's encrypted binary/serialized format. Never open or edit `.pen` files with plain text tools (`cat`, `grep`, text editors); always use the Pencil desktop app or `pen` CLI / MCP tools.

1. **Keep `docs/design/piksi-woodland.pen` and `docs/design/assets/` together** in the same directory so all relative image fills resolve automatically.
2. **Open in Pencil Desktop (from repo root):**
   ```sh
   ~/.local/opt/pen/current/pen --no-sandbox docs/design/piksi-woodland.pen
   ```
   Or open `docs/design/piksi-woodland.pen` via `File → Open` in the Pencil desktop app.
3. **Inspect or script headlessly via `pen` CLI:**
   ```sh
   pen interactive --in docs/design/piksi-woodland.pen --out docs/design/piksi-woodland.pen
   ```
4. **Saving edits from Pencil Desktop (explicit document-backup verification):**
   Pencil Desktop writes live canvas edits to `~/.pencil/backup/<hash>` rather than auto-saving over `docs/design/piksi-woodland.pen`. Because multiple `.pen` documents may have backups in `~/.pencil/backup/`, **do not blindly pick the newest file** (`ls -t`). Instead, verify which backup contains `piksi-woodland.pen`'s root boards (`C-01-Tokens-Components`, `M-01-Lobby-Create-Join`) before saving:
   ```sh
   for cand in "$HOME"/.pencil/backup/*; do
     if printf 'execute({ input: "Get((n,c)=>{if(c.depth===0){c.skipChildren();Print(n.name)}})" })\nexit()\n' \
       | pen interactive --in "$cand" --out /tmp/piksi-bkp-probe.pen 2>/dev/null \
       | grep -q "C-01-Tokens-Components"; then
       rm -f /tmp/piksi-bkp-probe.pen
       printf 'save()\nexit()\n' | pen interactive --in "$cand" --out docs/design/piksi-woodland.pen
       break
     fi
   done
   rm -f /tmp/piksi-bkp-probe.pen
   ```

---

## Complete Board Index (17 Required Boards)

Every required board is a top-level clipped frame (`clip: true`) at its exact specification size. PNG exports (rendered at 2× scale by Pencil's `Export` API) are saved under `docs/design/exports/<exact-board-name>.png`.

### Component & Catalog Boards (2)

| Board Name | Canvas Size | Position (`x, y`) | Export PNG | Summary |
| --- | --- | --- | --- | --- |
| `C-01-Tokens-Components` | `1600 × 1600` | `0, 0` | `exports/C-01-Tokens-Components.png` | All 28 color tokens (hex values set in `Press Start 2P` 16 px, with calculated flat sRGB token-pair ratios), typography scale (`Pixelify Sans` 400/600/700 UI + `Press Start 2P` 400 numerals at 16/24/32 px), geometry/font variables (`--font-ui`, `--font-numeral: 'Press Start 2P', monospace`), wood/plank/notch anatomy, reusable buttons/inputs/32 px `ABCD` room-code plaque/chips, danger `role="alert"` toast, score strip, 5 board-space states, native `55x77`/`60x84`/`120x168` cards (sizes printed in the numeral font; purple focus outside suit frame), RGB + hand-authored grayscale suit pattern samples, all 4 app icons, and Section 6 state variant strips. |
| `C-02-Animal-Card-Catalog` | `1600 × 1200` | `1700, 0` | `exports/C-02-Animal-Card-Catalog.png` | Canonical `shared/deck.ts` exemplars for animals 1–9 (`B1`, `G2`, `Y4`, `R5`, `B9`, `M4`, `Y13`, `R14`, `B15`) with `Press Start 2P` 24 px numerals, 16 px counts and 16 px deck codes, 4 special-spiral suits (`B6`, `G4`, `Y3`, `R2`), empty symbol row (`M1`), `back.webp`, animal-to-number rule bar, `Y4` Yellow Wheat suit vs neutral state/focus comparison, and the mobile native lineup (`55x77` opponent vs `60x84` own/display, 16 px numerals). |

### Paired Responsive Scene Boards (14 — 7 Stems × Mobile `390×844` & Desktop `1440×900`)

| Stem | Mobile Board (`390 × 844`) | Desktop Board (`1440 × 900`) | Scene Content |
| --- | --- | --- | --- |
| `01-Lobby-Create-Join` | `M-01-Lobby-Create-Join` (`0, 1720`) | `D-01-Lobby-Create-Join` (`460, 1720`) | Connected chip + `How to play`, fox-acorn logo, `PIKSI` wordmark, `A little magic for two`, `Gather your woodland friends` (cleanly wrapped on mobile), `Your name` filled (`Rowan`), focused `Create a game`, divider, empty `Room code` (`ABCD` placeholder in `Press Start 2P` 16 px) with disabled `Join game`, footer. |
| `03-Waiting-Invite` | `M-03-Waiting-Invite` (`0, 2740`) | `D-03-Waiting-Invite` (`460, 2740`) | `Waiting for a friend`, carved cream `ROOM CODE` plaque (`ABCD` in `Press Start 2P` 32 px, weight 400), `Copy invite link` primary button, `Waiting for your friend to join` status row. |
| `04-Game-My-Turn` | `M-04-Game-My-Turn` (`0, 3760`) | `D-04-Game-My-Turn` (`460, 3760`) | `Round 2 / 3 · Turn 4 · Pick 1 / 4` (Pixelify words + `Press Start 2P` 16 px numbers); `Choose a card from the display`; `Choose an animal`; Hazel (`22 total`, `15 pts` preview) & Rowan (`24 total`, `14 pts` preview) 3×3 grids showing `EMPTY`, `FACEDOWN_ONLY`, `FACEUP_ONLY`, and `VALIDATED`; 4 real display cards (`R5` focused, `Y4`, `R14`, `B15`). |
| `06-Game-Choose-Space` | `M-06-Game-Choose-Space` (`0, 4780`) | `D-06-Game-Choose-Space` (`460, 4780`) | `Round 2 / 3 · Turn 6 · Pick 4 / 4`; `Choose a highlighted empty space` + `Final pick` badge; `Choose an animal` gathering with pending `R2` card & explanation (mobile: heading and explanation in one column beside the card); ivory corner brackets on Rowan's empty spaces `6` and `9`. |
| `07-Game-Choose-Keep` | `M-07-Game-Choose-Keep` (`0, 5800`) | `D-07-Game-Choose-Keep` (`460, 5800`) | Forest-dark modal wash (`rgb(28 44 36 / 0.78)`, no blur) over live board; `A matching animal` eyebrow + required `Choose a card to keep` dialog comparing `On your board` (`B6` Blue 4, focused `Keep existing`) vs `Just picked` (`R5` Red 4, `Keep new`); no close/cancel control. Card numerals 16 px on mobile (112 px cards), 24 px on desktop (120 px cards). |
| `08-Round-Score` | `M-08-Round-Score` (`0, 6820`) | `D-08-Round-Score` (`460, 6820`) | `Round complete` banner + immediate `Round 2 complete` breakdown modal (round numeral `Press Start 2P` 24 px) over end-of-R2 boards (`Validated 14/15`, `Symbols 4/4`, `Largest color zone ×3 = 12/9`, `Round total 30/28`, `Overall total 54/50`, all 16 px), focused `Continue to next round`. |
| `09-Final-Results` | `M-09-Final-Results` (`0, 7840`) | `D-09-Final-Results` (`460, 7840`) | `You won!` title, brand emblem, complete R1/R2/R3/Total table (`Rowan · you` `24/30/38 = 92`, `Hazel` `22/28/35 = 85`; 16 px, desktop totals 24 px), `Ready for another game?`, focused `Play again`. |

### Mobile-Only Field Guide Board (1)

| Board Name | Canvas Size | Position (`x, y`) | Export PNG | Summary |
| --- | --- | --- | --- | --- |
| `M-11-Rules-Field-Guide` | `390 × 844` | `0, 8860` | `exports/M-11-Rules-Field-Guide.png` | Mobile scrollable `How to play` field-guide dialog with `44 × 44 px` focused `×` close button, updated rules copy (`Gather your woodland friends`, `Make a match`, `Count your magic`, `Card symbol legend`), and visible right-hand scroll track/thumb. |

---

## Continuation & Annotated Variant Strip Locations

Per §8 of the specification, non-scene states and the scrolled lower half of `M-11` are drawn both in **Section 6 of `C-01-Tokens-Components`** and as **compact labeled callout frames** immediately beside their closest scene board (exported separately in `docs/design/exports/` for direct inspection):

| Supporting Frame | Position (`x, y`) | Export PNG | Covered States |
| --- | --- | --- | --- |
| `Ref-01-Lobby-Variants` | `1940, 1720` (beside `D-01`) | `exports/Ref-01-Lobby-Variants.png` | `?room=ABCD` invite-prefilled join (empty-name disabled vs name-filled enabled), `Creating game…` / `Joining…` loading states, return-to-lobby `role="alert"` error toast, 16-char name & `ABCD` sample notes. |
| `Ref-03-Waiting-Copied` | `1940, 2740` (beside `D-03`) | `exports/Ref-03-Waiting-Copied.png` | In-button `Invite link copied` 2.5s feedback variant (no separate toast or URL field). |
| `Ref-04-Game-States` | `1940, 3760` (beside `D-04`) | `exports/Ref-04-Game-States.png` | Opponent turn (`choose_card`, `choose_keep`, `choose_space`), empty display (`No cards in the display`), opponent reconnecting (`Hazel is reconnecting…`), local disconnect (`Disconnected` / `Connecting…` chips + `Connection lost — reconnecting…`), in-game `role="alert"` toast. |
| `Ref-08-Round-3-Score` | `1940, 6820` (beside `D-08`) | `exports/Ref-08-Round-3-Score.png` | `Round 3 complete` title, `Connected cards × 4` zone detail, `See final results` button, disabled state while locally disconnected, zero/negative symbol score row sample. |
| `Ref-09-Results-Variants` | `1940, 7840` (beside `D-09`) | `exports/Ref-09-Results-Variants.png` | Opponent-win (`Hazel won!`) and tie (`It's a tie!`) headers, own rematch pending (`Waiting for Hazel…` + disabled `Rematch requested`), opponent rematch pending (`Hazel wants a rematch — Play again?` + active `Play again`), and a native `366 px` mobile `final-table` specimen demonstrating 16-character `MeadowbrookFox16` wrapping inside the `Player` column while `R1`/`R2`/`R3`/`Total` stay aligned in `Press Start 2P` 16 px. |
| `Ref-11-Rules-Continuation` | `420, 8860` (beside `M-11`) | `exports/Ref-11-Rules-Continuation.png` | Native `390 px` width continuation of `M-11-Rules-Field-Guide`: full 3-item `Card symbol legend`, 5-suit pattern + word key with `B6` Blue special-spiral correspondence, `Grow a color zone`, `The final turn`, and `Back to game` button. |

### Score Fixture Note

- **Round 2 boards (`04`, `06`, `07`, `08`)** use unique real cards from `shared/deck.ts` where `topCard.number === spaceNumber` on every face-up/validated slot, and their displayed Round 2 previews/breakdowns (`Rowan`: `14 + 4 + 12 = 30`, `Hazel`: `15 + 4 + 9 = 28`) match the exact rules in `shared/scoring.ts` (though this phase does not execute app tests/builds).
- **Round 1 (`24` vs `22`) and Round 3 (`38` vs `35`, final `92` vs `85`)** totals are internally consistent illustrative values matching §8 of the spec.

---

## Native 1× Numeral Tests & `--font-numeral` Rationale

Both tests are true `1×` Pencil renders (`Export` with `scale: 1`), each with a 1 px dark/ivory tick ruler. They are supporting images, not boards, and their scratch frames are not kept in the `.pen` document.

| Test Export | Physical Pixel Size | Purpose & Findings |
| --- | --- | --- |
| `exports/Test-Numerals-1x-Press-Start-2P.png` | `1280 × 789 px` (`1×`) | `Press Start 2P` weight 400 at `16`, `24`, and `32 px`: `0123456789`, `S5 5S B8 8B Z2 2Z G6 6G`, `54 50`, `+5`, `ABCD`, and `Round 2 / 3 · Turn 4 · Pick 1 / 4` at every size, plus the production mixed metadata line (Pixelify words + 16 px numeric spans) and an inverse 16 px row on the dark signboard. Its ruler is 400 px long: single-pixel columns alternate dark/ivory, with taller marks every 10 px (checked pixel-by-pixel). Every pair `5`/`S`, `8`/`B`, `2`/`Z`, `6`/`G` is distinct at all three sizes. |
| `exports/Test-Numerals-1x-Pixelify-Sans.png` | `1281 × 683 px` (`1×`) | Comparison test of `Pixelify Sans` 400/600/700 at `12, 14, 16, 22, 32 px`. `5`/`S`, `2`/`Z`, and `8`/`B` collide at every weight (`54 50` reads `S4 S0`, `+5` reads `+S`), so Pixelify stays the prose font and is not used for numerals. |

- **Chosen numeral face (`--font-numeral: "Press Start 2P", monospace`):** a user decision based on real-Chromium renders. It is canonical 8-bit and separates the letter/digit pairs that Pixelify merges. Google Fonts specimen `https://fonts.google.com/specimen/Press+Start+2P`; licensed under **SIL Open Font License 1.1** (`https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/OFL.txt`).
- **Single weight:** the family has only weight `400`. No numeral node in the sketch sets a bold weight, and implementation must not synthesize bold.
- **Sizes (8 px multiples only):** `16 px` for symbol counts, scores, totals, previews, `R1`–`R3`, metadata spans, mobile card/slot numerals, room-code inputs, deck codes, and C-01 hex values; `24 px` for desktop card/slot numerals, the `Round N complete` numeral, and desktop final totals; `32 px` for the waiting `ROOM CODE` plaque (M-03, D-03, and the C-01 `Comp/Room-Code-Plaque` component). The sketch has no 12, 14, 18, 20, 22, or 26 px numerals.
- **Metadata strategy:** every phase on mobile and desktop uses Pixelify words/separators (`12 px` mobile, `14 px` desktop) with `Press Start 2P` 16 px numeric spans. A whole-line 16 px string would need about 528 px and cannot share the 366 px mobile signboard with `PIKSI`. The header never overlaps the tools row or `PIKSI`.
- **Scope:** `Press Start 2P` sets card numerals, empty-slot numbers, symbol counts, player/round/final scores and previews, `R1`/`R2`/`R3`, the `Round N complete` numeral, the color-zone multiplier (`× 3` / `× 4`), the round/turn/pick numbers, and `ABCD` room codes. Prose UI, headings, buttons, guidance, suit labels (`BLUE`/`GREEN`/`YELLOW`/`RED`/`ALL`), and numbers inside running prose (rules text, “Your 1 is already validated”) stay in `Pixelify Sans` (`--font-ui`, ≥ 12 px, body 16 px).

### Pencil font audit (Pencil `execute` API)

The same `Get` visitor plus `GetVariables()` was run on the live desktop canvas and on the saved `piksi-woodland.pen` through `pen interactive`. Both report:

- Text font families: `$font-ui` 720 nodes and `$font-numeral` 526 nodes; no other family. Variables are `font-ui = "Pixelify Sans"` and `font-numeral = "Press Start 2P"`.
- `$font-numeral` sizes: `16 px` × 432, `24 px` × 91, `32 px` × 3, all at weight 400 (serialized as `normal`). None fall outside 16/24/32.
- No retired numeral font remains: every text node uses one of the two variables, no content names another typeface, and no `--font-ui` text is below 12 px.
- All 17 image-fill URLs are relative (`assets/assets/bg/…`, `assets/assets/brand/logo.webp`, `assets/assets/cards/animal-1…9.webp`, `assets/assets/cards/back.webp`, `assets/icons/…`); none are absolute, `/tmp`, or remote.

---

## Fit Issues Solved During the Press Start 2P Cutover

| Issue | Fix |
| --- | --- |
| Compact `48 px` mobile opponent cards could not hold a 16 px numeral, a scoring glyph + 16 px count, and the 12 px `YELLOW` footer. | Opponent cards now measure `55 × 77 px` (still exactly 5:7). The opponent grid is `173 × 239 px` with 4 px gaps. Text is never shrunk or squeezed. |
| On `M-06`, the two-line `Choose a highlighted empty space` guidance plus the `Final pick` badge (18 px taller than one-line guidance) pushed the own board's bottom rim past 844 px. | The mobile gathering panel now puts `Choose an animal` / `Place your card` and the explanation in one column beside the 60 px pending card. The panel shrinks from 124 to 102 px, and the whole own board, rim included, is visible in 844 px. |
| `M-07` keep-dialog cards used 24 px numerals on mobile. | Set to 16 px to match the mobile card rule. Desktop `D-07` keeps 24 px. |
| The C-01 `Comp/Room-Code-Plaque` component used a 24 px code. | Set to 32 px with no extra tracking (128 px glyph run inside the 152 px plaque). |
| Pixelify annotation captions turned data into letters (`55×77` read as `SS×77`, `B1` read as `81`, `#5F7945` read as `#SF794S`, `5s` read as `Ss`, `§` drew as `£`). | Card-size captions, deck codes, app-icon sizes, and C-01 hex values now use `Press Start 2P` 16 px. Headings that repeated the sizes were reworded, durations are spelled out (“five seconds”, “two and a half seconds”), and `§` became “spec section”. |
| Desktop metadata words were 15 px. | Set to 14 px to match the spec's metadata row. |

---

## Legibility & Rendering Notes for Implementation Review

1. **Pencil Image Fill Sampler Limitation (`image-rendering: pixelated`):**
   - `.pen` schema `v2.21` `Fill` (`type: "image"`) supports `mode: "cover" | "contain" | "stretch"` and `transform`, **not** a per-fill `image-rendering: pixelated` / nearest-neighbor sampler flag.
   - Because the supplied woodland assets were pre-upscaled with integer `NEAREST` factors (`768×768` binary-alpha animal sprites, `1024×1024` emblem, `720×1008` back, `2560×1440` and `1080×1920` backgrounds), sprites remain crisp in Pencil exports, with slight bilinear softening only at the smallest `55 px` card downscale.
   - **Implementation action:** Apply CSS `image-rendering: pixelated` (and integer CSS dimensions where practical) to `.card-art`, `.card-back`, `.brand-emblem`, `.end-emblem`, and scenic backgrounds as specified in §1. Never apply it to text.
2. **Press Start 2P rasterization:** the 8 × 8 glyph grid stays crisp only at 8 px multiples on whole-pixel positions. Keep `--font-numeral` at 16/24/32 px, avoid fractional transforms on numeral containers, and leave `font-weight` at 400. Browser checks at other device pixel ratios remain an implementation task.
3. **Mobile Vertical Page Scrolling (`390 × 844` and shorter viewports / 200% text zoom):**
   - `M-04` and `M-06` fit all three board zones, the `44 px` tools row, the round/turn/pick header, and the guidance strip within `844 px` at native size, with 16 px numerals throughout. `M-11` demonstrates explicit internal dialog scrolling with its continuation in `Ref-11`. Implementation CSS must allow natural vertical document/modal scrolling (`overflow-y: auto`, never `overflow: hidden` on the game shell) so shorter phone viewports, longer names, and 200% text zoom never clip the own board or actions.
4. **Contrast Ratios & Color-Vision Simulation Status (Not Simulated in Sketch Phase):**
   - Contrast ratios cited on `C-01` (`13.66:1`, `6.23:1`, `10.66:1`, `6.83:1`, `6.42:1`, `5.69:1`) are the **calculated flat sRGB token-pair values** from §7 of the design specification, not an executed rendered-UI contrast audit.
   - `C-01` Section 3 includes a hand-authored **grayscale pattern sample** showing how `BLUE` (paired horizontal bars), `GREEN` (vertical dashes), `YELLOW` (dark-outlined wheat + `2×2` dots), `RED` (stepped diagonals), and `ALL` (4 hard segments) separate by pattern and printed suit word without hue. **Actual protanopia/deuteranopia CVD simulation and rendered-page contrast checks were not performed** in this sketch phase and remain part of implementation/browser verification.
