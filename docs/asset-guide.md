# Piksi asset guide

Piksi's **Twilight Arcane, modernized** identity combines a low-contrast twilight woodland with layered violet glass, soft glows and storybook pixies. UI typography is Outfit; Pixelify Sans is reserved for the PIKSI wordmark and large card numerals. Color tokens live in `frontend/src/index.css`: the four suits are blue `#6ea8ff`, green `#5ce6b0`, yellow `#ffcf5c`, and rose `#ff7b9c`; selectable and validated states use lavender `#e6d8ff`, never the rose suit.

## Runtime artwork

All paths are relative to `frontend/public/`. See `assets/MANIFEST.md` for artwork production details.

| Asset | Dimensions | Purpose |
| --- | --- | --- |
| `assets/bg/twilight-forest.webp` | 2560 × 1440 | Dark, low-contrast landscape app background |
| `assets/bg/twilight-forest-portrait.webp` | 1080 × 1920 | Portrait background on small screens |
| `assets/brand/logo.webp` | 1024 × 1024 | Transparent emblem on lobby and final results |
| `assets/cards/back.webp` | 720 × 1008 | Portrait 5:7 face-down card |
| `assets/cards/pixie-1.webp` … `pixie-9.webp` | 768 × 768 | Transparent, centered illustrations for each card number |
| `icons/icon-192.png` | 192 × 192 | Standard web app icon |
| `icons/icon-512.png` | 512 × 512 | Standard web app icon |
| `icons/icon-maskable-512.png` | 512 × 512 | Maskable web app icon |
| `icons/apple-touch-icon.png` | 180 × 180 | Apple home-screen icon |

Card illustrations are decorative: the number, suit name/color, and symbol counts remain visible independently of the artwork. Multicolor cards count as all four suits; a colored special spiral represents one point per face-up card of that color. The card back must conceal the underlying card identity.

## UI and accessibility

Use the CSS tokens rather than new color literals in components. Panels and buttons are styled in CSS; the app supports keyboard focus and reduced motion. The forest is a background, not a source of essential information. Icons and images used decoratively have empty alt text, while each playable card has a descriptive accessible label.
