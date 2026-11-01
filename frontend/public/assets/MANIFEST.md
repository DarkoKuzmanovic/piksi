# Piksi — Woodland pixel-art assets

Piksi uses original cozy 8-bit / 16-bit woodland pixel art. Card numbers map to woodland animals.
Runtime files were copied from the accepted portable sketch in `docs/design/assets/`.
The accepted visual target is `docs/design/piksi-woodland.pen` with PNG exports in `docs/design/exports/`.

Generated with **gpt-image-2 via the Codex CLI's built-in `image_gen` tool** (ChatGPT OAuth in
`authenticated CLI session`; no `OPENAI_API_KEY` on this machine). One `codex exec` call per asset:

```sh
cd /tmp/piksi-woodland-art
codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox \
  "Use your image generation tool to create exactly one image: <prompt>"
```

Runs were fanned out over four isolated `CODEX_HOME` copies (`/tmp/codex-h0…h3`, each holding only
`auth.json` + `config.toml`), so each run writes to its own `generated_images/<session>/` and output→asset
mapping is unambiguous instead of depending on which session directory is newest.

Sources: `src/<asset>.png` (full resolution, as returned). Finals: `final/` (this tree mirrors the
frontend asset layout). Driver: `gen.sh`; post-processing: `post.py` (PIL 13.0.0); exact prompts:
`prompts.py` / `prompts.json`. Contact sheet: `/tmp/piksi-woodland-art/contact-sheet.png`.

## Shared style preamble (appended verbatim to every generation prompt)

> Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark.

## Files

| File | Dimensions | Mode | Alpha | Bytes |
|---|---|---|---|---|
| `assets/bg/woodland.webp` | 2560×1440 | RGB | opaque | 53,760 |
| `assets/bg/woodland-portrait.webp` | 1080×1920 | RGB | opaque | 38,712 |
| `assets/brand/logo.webp` | 1024×1024 | RGBA | transparent (binary) | 4,712 |
| `assets/cards/back.webp` | 720×1008 | RGB | opaque | 25,610 |
| `assets/cards/animal-1.webp` | 768×768 | RGBA | transparent (binary) | 2,988 |
| `assets/cards/animal-2.webp` | 768×768 | RGBA | transparent (binary) | 4,006 |
| `assets/cards/animal-3.webp` | 768×768 | RGBA | transparent (binary) | 4,022 |
| `assets/cards/animal-4.webp` | 768×768 | RGBA | transparent (binary) | 4,628 |
| `assets/cards/animal-5.webp` | 768×768 | RGBA | transparent (binary) | 3,474 |
| `assets/cards/animal-6.webp` | 768×768 | RGBA | transparent (binary) | 4,498 |
| `assets/cards/animal-7.webp` | 768×768 | RGBA | transparent (binary) | 3,062 |
| `assets/cards/animal-8.webp` | 768×768 | RGBA | transparent (binary) | 5,046 |
| `assets/cards/animal-9.webp` | 768×768 | RGBA | transparent (binary) | 3,946 |
| `icons/icon-192.png` | 192×192 | RGBA | transparent (binary) | 4,443 |
| `icons/icon-512.png` | 512×512 | RGBA | transparent (binary) | 10,257 |
| `icons/icon-maskable-512.png` | 512×512 | RGB | opaque | 9,330 |
| `icons/apple-touch-icon.png` | 180×180 | RGB | opaque | 4,001 |

Every WebP was written lossless *and* at quality 90 and the smaller file kept; lossless won in
every case (24–32 colour pixel art compresses far better losslessly than lossily).

## Post-processing

Two earlier post-processing defects were fixed rather than papered over: (1) alpha was originally thresholded at full resolution before downscaling, which left ragged, noisy silhouettes — replaced with premultiplied-alpha BOX downscaling and a single binarise step at logical resolution; (2) Floyd–Steinberg dithering on the 24-colour sprites produced speckle noise instead of clean pixel bands — sprites and the emblem are now quantized without dither.

Common steps: trim to the alpha bounding box → downscale with BOX to a logical pixel grid →
quantize to a limited palette (octree) → upscale by an integer factor with NEAREST → centre-pad.
Binary alpha means no anti-aliased edge pixels anywhere, so the art scales cleanly at any size.

### Composited icons (no generation)

`icons/*` are built locally from `src/logo.png`: trimmed, re-snapped onto a logical grid whose integer
upscale factor lands the emblem at ~80 % of the tile (66 % for maskable), composited on solid
`#1f2a1c` dark forest green. `icon-192` / `icon-512` get a rounded-rect alpha mask (radius 18 %);
`icon-maskable-512` and `apple-touch-icon` are fully opaque RGB.

## Per-file detail

### `assets/bg/woodland.webp` — 2560×1440, 53,760 B

Prompt:

> Wide 16:9 landscape background for a game user interface, 2560 by 1440, opaque. A wide forest clearing in late golden afternoon light. Tall pixel pine and oak trees, leafy bushes, ferns and a few mushrooms frame only the far left and right edges; a few fireflies and drifting leaves near the edges. The wide central area is a calm, low-detail meadow of soft muted grass with low contrast and gentle, nearly empty space, so UI panels can sit on top of it. Slight soft vignette at the edges. No animals, no people, no buildings, no path, no signs. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Landscape 16:9 composition.

Post-processing: Logical grid 640×360 (BOX downscale of the 1672×941 source), 32-colour octree quantize with Floyd–Steinberg dither (finer for a soft sky gradient), NEAREST ×4 to 2560×1440, centre-cropped to the exact 16:9 frame. Encoded WebP lossless (smaller than q90: 53,760 B vs 212,202 B).

### `assets/bg/woodland-portrait.webp` — 1080×1920, 38,712 B

Prompt:

> Tall 9:16 portrait background for a phone game user interface, 1080 by 1920, opaque, image size 1080x1920. A tall forest clearing in late golden afternoon light. Framing pixel pine and oak trees, bushes, ferns and mushrooms only at the top and bottom edges; a few fireflies and drifting leaves near the edges. The tall middle area is a calm, low-detail meadow of soft muted grass with low contrast and nearly empty space, so UI panels can sit on top of it. Slight soft vignette at the edges. No animals, no people, no buildings, no path. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Tall 9:16 portrait composition.

Post-processing: Logical grid 270×480, 32-colour dither quantize, NEAREST ×4 to 1080×1920, cropped to exact 9:16. Lossless (38,712 B vs 150,058 B at q90).

### `assets/brand/logo.webp` — 1024×1024, 4,712 B

Prompt:

> Square emblem logo for a cozy woodland card game, 1:1 composition, isolated on a fully transparent background with a real alpha channel and absolutely no scenery behind the subject. Subject: a round carved wooden shield badge with a dark forest-green inset face and a small oak-leaf sprig at the top edge. In the middle of the badge, a small russet-orange fox curled around a large acorn, its bushy tail wrapped around the acorn. Chunky bold symmetrical silhouette with thick 1-pixel dark outline, strong and readable as a 32 pixel icon. Generous empty margin all around the badge, nothing else in the frame. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background, no ground shadow, no text on the badge.

Post-processing: Source trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 128 px logical grid, alpha binarised at 0.5 so the silhouette gets a clean stepped 1-pixel contour, 28-colour octree quantize **without** dither (a dithered emblem speckles at large display sizes), then integer NEAREST ×6 and centred at ~70 % of the 1024 canvas for a generous margin. Lossless (4,712 B).

### `assets/cards/back.webp` — 720×1008, 25,610 B

Prompt:

> The back of a game card, exactly 5:7 portrait proportions, flat-on front view, perfectly symmetrical, opaque. Around the edges, a symmetrical frame of carved wooden planks with carved corner ornaments and a thin geometric border line. In the exact centre, a medallion of one single acorn with two crossed oak leaves, stitched or appliqued on dark forest-green cloth. Purely decorative and symmetrical: it must not suggest any number, rank, suit or suit colour. Muted earthy browns, honey and dark forest green only. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Exactly 5:7 portrait.

Post-processing: Logical grid 180×252 (exact 5:7), 32-colour dither quantize, NEAREST ×4 to 720×1008, cropped. Lossless (25,610 B vs 66,956 B at q90).

### `assets/cards/animal-1.webp` — 768×768, 2,988 B

Prompt:

> One single character sprite for a card game, number 1 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A tiny field mouse standing upright on its hind legs, big round ears, long thin tail curled on the ground, warm grey and cream fur, small and delicate. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-2.webp` — 768×768, 4,006 B

Prompt:

> One single character sprite for a card game, number 2 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A small frog sitting still with a rounded low body, muted olive-khaki skin with darker speckles, pale cream belly and throat, large calm dark eyes. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-3.webp` — 768×768, 4,022 B

Prompt:

> One single character sprite for a card game, number 3 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A hedgehog standing on short legs, spiny back in bark-brown and honey tones, cream face and belly, small paws, gentle shy expression. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-4.webp` — 768×768, 4,628 B

Prompt:

> One single character sprite for a card game, number 4 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A squirrel sitting upright on its haunches holding a single acorn in its front paws. Its fur is warm hazel-brown and chestnut, deliberately desaturated and browner than orange, with a pale cream belly and a big fluffy tail curving up behind it. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

Regenerations: Regenerated once. v1 came back a saturated orange squirrel that would have read as the red suit and competed with the fox; the prompt was changed to "warm hazel-brown and chestnut, deliberately desaturated and browner than orange" and the art regenerated (v1 kept at `src/animal-4.v1.png`).

### `assets/cards/animal-5.webp` — 768×768, 3,474 B

Prompt:

> One single character sprite for a card game, number 5 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A rabbit sitting upright with tall ears, warm grey-brown fur and cream chest, calm alert pose, small round tail visible. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-6.webp` — 768×768, 4,498 B

Prompt:

> One single character sprite for a card game, number 6 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A badger standing four-square, low and broad sturdy body, charcoal-grey fur with cream stripes down the face, dark stocky paws, strong and steady. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-7.webp` — 768×768, 3,062 B

Prompt:

> One single character sprite for a card game, number 7 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A red fox sitting proudly with its bushy tail curled around its front paws, russet-orange coat with cream chest and dark stockings, tall sharp ears, confident. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-8.webp` — 768×768, 5,046 B

Prompt:

> One single character sprite for a card game, number 8 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A large owl perched upright, rounded feathered body in bark-brown and cream, big amber-gold eyes, folded wings, dignified and wise. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `assets/cards/animal-9.webp` — 768×768, 3,946 B

Prompt:

> One single character sprite for a card game, number 9 of a series, isolated on a fully transparent background with a real alpha channel and absolutely no scenery, no ground, no shadow behind the subject. Subject: A majestic stag standing tall with huge branching antlers spreading wide above its head, warm brown coat with cream chest and neck, proud regal pose, the largest and most imposing creature of the woodland. Seen from a front three-quarter view, full body visible, sitting or standing still, calm and friendly, centred in a square 1:1 frame with margin around it. Muted natural colours only: browns, greys, creams, russet, muted olive, honey. Absolutely no strong blue, no saturated green, no bright yellow and no bright red anywhere in the image. Same sprite style, same 1-pixel outline weight, same light direction from the upper left and same pixel density for every card in the series, like a 64 by 64 pixel sprite scaled up. Cozy pixel art in the style of Stardew Valley: crisp hard-edged pixels on a visible pixel grid, limited warm earthy palette (forest greens, bark browns, honey, cream, soft sky blue), 1-pixel dark outlines, simple dithered shading, no anti-aliasing, no blur, no gradients, no painterly brushwork, not 3D, not photoreal. No text, no letters, no numbers, no watermark. Transparent background.

Post-processing: Trimmed to alpha bounds, premultiplied-alpha BOX downscale to a 120 px logical grid, alpha binarised at 0.5, 24-colour octree quantize without dither, integer NEAREST ×5 → 600 px max dimension, centred on 768×768 at ~79 % of the frame. Identical logical grid and upscale factor for all nine cards, so pixel density, outline weight and light direction match across the series. Lossless WebP (lossless is far smaller than q90 for 24-colour art).

### `icons/*` — composited

No generation prompt; see the composited-icons section above. 192×192 (4,443 B), 512×512
(10,257 B), maskable 512×512 (9,330 B), apple-touch 180×180 (4,001 B).

## Known limitations

- Numeric "size escalation" is carried by the art, not the framing: all nine animals share one
  logical grid (120 px) and one 79 % frame fill so that pixel density and outline weight stay
  identical across a card fan — the mouse is drawn small, the stag large, but their canvases match.
- `animal-3` (hedgehog): the spiny back quantizes into a speckled texture rather than clean facets;
  it reads as fur at card size but is the least "banded" of the nine.
- `logo`: at full 1024 px the fox's muzzle and the acorn butt read as one mass; at icon sizes
  (32–192 px) the emblem separates cleanly, which is what it is for.
- The fox (`animal-7`) and the squirrel (`animal-4`) are warm russet/hazel by nature; both stay clear
  of the bright red, saturated green, bright yellow and blue suit colours, but the fox is the warmest
  sprite in the set.

