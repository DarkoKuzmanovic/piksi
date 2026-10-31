# Piksi artwork manifest

All raster art for Piksi — "Twilight Arcane, modernized storybook".

Generated with OpenAI's image model through the **Codex built-in `image_gen.imagegen` tool**
(ChatGPT OAuth login; no `OPENAI_API_KEY` exists on this machine, and the OpenAI Images API
therefore returned `401 invalid_api_key` for the only key available). `image_gen` is the
gpt-image-2 family generation path, requested with `transparent_background=true` wherever
an alpha channel is required, then normalised to exact sizes and encoded to WebP
(quality ladder 86→54, method 6, alpha preserved).

Deliverables are post-processed copies; full-resolution source PNGs live outside the repo in
`/tmp/piksi-art-src/gen/`. Contact sheet: `/tmp/piksi-art-src/contact-sheet.png`.

## Files

| File | Dimensions | Bytes | Notes |
|---|---|---|---|
| `assets/bg/twilight-forest.webp` | 2560×1440 | 250,728 | opaque, low-contrast centre |
| `assets/bg/twilight-forest-portrait.webp` | 1080×1920 | 204,762 | opaque, low-contrast centre |
| `assets/brand/logo.webp` | 1024×1024 | 189,556 | transparent emblem |
| `assets/cards/back.webp` | 720×1008 | 134,764 | opaque, symmetrical |
| `assets/cards/pixie-1.webp` | 768×768 | 68,626 | transparent |
| `assets/cards/pixie-2.webp` | 768×768 | 103,460 | transparent |
| `assets/cards/pixie-3.webp` | 768×768 | 103,274 | transparent |
| `assets/cards/pixie-4.webp` | 768×768 | 103,186 | transparent |
| `assets/cards/pixie-5.webp` | 768×768 | 88,506 | transparent |
| `assets/cards/pixie-6.webp` | 768×768 | 91,196 | transparent |
| `assets/cards/pixie-7.webp` | 768×768 | 103,684 | transparent |
| `assets/cards/pixie-8.webp` | 768×768 | 89,734 | transparent |
| `assets/cards/pixie-9.webp` | 768×768 | 139,326 | transparent |
| `icons/icon-192.png` | 192×192 | 41,638 | logo on #140d24, rounded |
| `icons/icon-512.png` | 512×512 | 159,731 | logo on #140d24, rounded |
| `icons/icon-maskable-512.png` | 512×512 | 134,752 | logo inside 66% safe zone, solid #140d24 |
| `icons/apple-touch-icon.png` | 180×180 | 27,972 | opaque, square |

Pixies are trimmed to their alpha bounds and re-centred on the 768×768 canvas at 80% of the
frame (≈10% padding). The PWA icons are composited locally from `logo.webp`'s source PNG;
no generation prompt applies to them.

## Prompts

### `assets/bg/twilight-forest.webp`

> Wide 16:9 landscape view of a twilight enchanted forest interior at night, painterly digital
> illustration, modernized storybook. Palette strictly deep violet-black #140d24 and indigo,
> with soft magenta #ff5ca8 and lavender #c8a8ff bioluminescent glow, tiny periwinkle, mint,
> gold and rose accents. Very dark, low contrast image; no bright sky, no sunset, no castle,
> no buildings. Silhouetted tall trees and ferns framing the far left and right edges, glowing
> mushrooms and drifting fireflies only near the edges, faint floating motes of light. The wide
> central area is nearly empty, very dark and calm, unobtrusive so UI panels can sit on top.
> Soft vignette, subtle sparkle. No characters, no creatures, no text, no letters, no watermark.

### `assets/bg/twilight-forest-portrait.webp`

> Tall 9:16 portrait phone wallpaper of the same twilight enchanted forest at night, painterly
> digital illustration, modernized storybook. Palette strictly deep violet-black #140d24 and
> indigo, with soft magenta #ff5ca8 and lavender #c8a8ff bioluminescent glow, tiny periwinkle,
> mint, gold and rose accents. Very dark, low contrast image, image size 1080x1920; no bright
> sky, no sunset, no castle, no buildings. Silhouetted tall trees, hanging vines, ferns and
> glowing mushrooms framing the top and bottom edges, drifting fireflies and faint floating
> motes of light near the edges. The wide middle area is nearly empty, very dark and calm,
> unobtrusive so UI panels can sit on top. Soft vignette, subtle sparkle. No characters, no
> creatures, no text, no letters, no watermark.

### `assets/brand/logo.webp` (transparent_background=true)

> Transparent-background emblem for a fantasy card game: a small pixie with large glowing
> lavender and magenta moth-like wings, seen from the front, hovering inside an elegant thin
> crescent-moon sigil with delicate arcane filigree and small orbiting sparkles. Painterly
> digital storybook illustration, not photoreal, not 3D render. Violet-black, indigo, magenta
> #ff5ca8 and lavender #c8a8ff glow, a few tiny periwinkle, mint, gold and rose sparkles, soft
> rim light. Perfectly centered, symmetrical, strong clean silhouette that stays readable as a
> tiny icon, generous empty margin all around, plain transparent background. Square 1:1
> composition. No text, no letters, no numbers, no watermark, no logo lettering.

### `assets/cards/back.webp`

> Back of a fantasy card game card, exactly 5:7 portrait proportions, perfectly symmetrical,
> flat-on front view. Ornate arcane border with fine filigree corner ornaments, a large
> symmetrical magical sigil in the center made of interlocking rings and four small flower
> medallions, deep violet-black #140d24 background with magenta #ff5ca8 and lavender #c8a8ff
> luminous glow, tiny sparkles, subtle inner vignette, crisp clean edges. Painterly digital
> storybook illustration. No text, no letters, no numbers, no watermark.

### Shared pixie style preamble (used verbatim in every pixie prompt)

> Small slender pixie character, painterly digital storybook illustration, not photoreal, not
> 3D render. Pale lavender-violet skin, short flowing silver-lilac hair, large translucent
> luminous wings in lavender and magenta with delicate veins, simple deep-violet bodice and
> short petal skirt, soft magenta-lavender rim light from upper left, faint glowing dust.
> Palette limited to violet, indigo, magenta and lavender; no green leaves, no gold wings, no
> warm skin tones. Square 1:1 composition, centered subject with about 10 percent empty margin,
> plain transparent background, crisp clean silhouette readable at 48 pixels. No text, no
> letters, no watermark.

### `assets/cards/pixie-1.webp`

> A lone pixie with wings fully outstretched, hovering in a calm pose, seen from the front, full
> wingspan visible. Small slender pixie character, painterly digital storybook illustration, not
> photoreal, not 3D render. Pale lavender-violet skin, short flowing silver-lilac hair, large
> translucent luminous wings in lavender and magenta with delicate veins, simple deep-violet
> bodice and short petal skirt, soft magenta-lavender rim light from upper left, faint glowing
> dust. Palette limited to violet, indigo, magenta and lavender; no green leaves, no gold wings,
> no warm skin tones. Centered, full body visible with about 10 percent empty margin, plain
> transparent background, crisp clean silhouette readable at 48 pixels. No text, no letters, no
> watermark.

### `assets/cards/pixie-2.webp`

> Two pixies facing each other with mirrored poses, wings raised and touching tip to tip, a thin
> thread of lavender light connecting their hands. + shared pixie style preamble. No text, no
> letters, no watermark.

### `assets/cards/pixie-3.webp`

> Three pixies in a loose circle around a glowing lavender-magenta orb floating between them,
> wings lit from below by the orb. + shared pixie style preamble. No text, no letters, no
> watermark.

### `assets/cards/pixie-4.webp`

> A pixie perched on a large four-leaf clover, one hand raised, wings folded slightly. The clover
> is made of pale translucent lavender and silver crystalline leaves glowing faint lilac,
> periwinkle and white, with delicate internal facets and small sparkles, and absolutely no
> green. Small slender pixie character, painterly digital storybook illustration, not photoreal,
> not 3D render. Pale lavender-violet skin, short flowing silver-lilac hair, large translucent
> luminous wings in lavender and magenta with delicate veins, simple deep-violet bodice and short
> petal skirt, soft magenta-lavender rim light from upper left, faint glowing dust. Palette
> limited to violet, indigo, periwinkle, silver, magenta and lavender; no green anywhere, no gold
> wings, no warm skin tones. Square 1:1 composition, centered subject with about 10 percent empty
> margin, plain transparent background, crisp clean silhouette readable at 48 pixels. No text,
> no letters, no watermark.

### `assets/cards/pixie-5.webp`

> A pixie surrounded by exactly five bright fireflies orbiting in a loose ring, each tiny light
> glowing gold and lavender. + shared pixie style preamble, with "gold firefly pinpoints; no
> green leaves, no gold wings, no warm skin tones". No text, no letters, no watermark.

### `assets/cards/pixie-6.webp`

> A pixie standing on a cluster of pale violet crystals, sharp faceted shapes glowing faint
> periwinkle and lavender, wings spread. + shared pixie style preamble, with "violet, indigo,
> periwinkle, magenta and lavender". No text, no letters, no watermark.

### `assets/cards/pixie-7.webp`

> A pixie hovering with exactly seven thin wisp trails of lavender smoke spiralling around her,
> flowing curls of light. + shared pixie style preamble. No text, no letters, no watermark.

### `assets/cards/pixie-8.webp`

> A pixie sitting in the center of a large eight-petal flower, petals glowing rose and lavender,
> legs dangling. + shared pixie style preamble, with "violet, indigo, magenta, rose and
> lavender". No text, no letters, no watermark.

### `assets/cards/pixie-9.webp`

> A grand pixie queen with enormous fully spread luminous wings filling the frame, a tall crown
> of glowing light, radiant lavender and magenta aura, floating regal pose, the most majestic
> figure of the series. Small slender pixie character grown regal, painterly digital storybook
> illustration, not photoreal, not 3D render. Pale lavender-violet skin, long flowing
> silver-lilac hair, large translucent luminous wings in lavender and magenta with delicate
> veins, simple deep-violet gown and petal mantle, soft magenta-lavender rim light from upper
> left, faint glowing dust. Palette limited to violet, indigo, magenta and lavender with tiny
> periwinkle, mint, gold and rose sparkles; no green leaves, no gold wings, no warm skin tones.
> Square 1:1 composition, centered subject with about 10 percent empty margin, plain transparent
> background, crisp clean silhouette readable at 48 pixels. No text, no letters, no watermark.

Every other asset was a single `image_gen.imagegen` call with the prompt passed verbatim.
`pixie-4.webp` was regenerated once after review: the first clover was mint-green and would
have read as the green suit colour, so it was replaced with a neutral lavender/silver
crystalline clover. All nine pixies are mutually consistent in character, palette and
lighting, and none of the card art bakes in a suit colour.
