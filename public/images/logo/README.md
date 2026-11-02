# AMAPELS Logo Assets

Source artwork and the generated, theme-ready logo files for the storefront.

## Source files (this folder)

| File | Artwork |
| --- | --- |
| `amapels-mark-gold-on-black.jpg` | A monogram, brand gold on black |
| `amapels-mark-ink-on-white.jpg` | A monogram, ink on white |
| `amapels-mark-gold-on-white.jpg` | A monogram, brand gold on white |
| `amapels-wordmark-gold-on-black.jpg` | Full AMAPELS wordmark, brand gold on black |
| `IMG_3828.JPEG` … `IMG_3831.JPEG` | Original exports from the brand kit |
| `WhatsApp Image …jpeg` | Original exports from the brand kit |

The JPEGs have their background baked in, so they are **not** used directly in
the UI.

## Generated files (`/public/images/brand/`)

| File | Use |
| --- | --- |
| `mark-gold.png` | A monogram on dark/ink surfaces |
| `mark-ink.png` | A monogram on paper/light surfaces |
| `mark-cream.png` | A monogram on photography or coloured surfaces |
| `wordmark-gold.png` | Full lockup on dark/ink surfaces |
| `wordmark-ink.png` | Full lockup on paper/light surfaces |
| `wordmark-cream.png` | Full lockup on photography or coloured surfaces |

All are transparent PNGs with the background keyed out and the margins trimmed.

## Using the logo

Use the `Logo` component. It paints the correct file from `data-theme` in CSS,
so there is no hydration flash and no client-side theme check.

```tsx
import Logo from '@/components/Logo'

// Follows the theme: ink on paper, gold on dark
<Logo variant="wordmark" className="h-7 w-44" priority />

// Monogram for tight spaces, loaders and avatars
<Logo variant="mark" className="h-10 w-10" />

// Pin a tone when the surface does not follow the page theme
<Logo variant="wordmark" tone="gold" className="h-8 w-64" />
```

| Variant | What it is |
| --- | --- |
| `mark` | The serif A with the diamond accent |
| `wordmark` | The full AMAPELS wordmark |

| Tone | Surface |
| --- | --- |
| `auto` | Page theme (ink in light mode, gold in dark mode) |
| `ink` | Light surfaces, printed receipts, white emails |
| `gold` | Dark surfaces, the intro overlay, admin chrome |
| `cream` | Photography or a coloured panel |

## Where the logo is wired

- Storefront navbar and footer
- Intro overlay
- Admin login and admin top bar
- Order confirmation
- Order confirmation email and printable receipt
- Favicon, Apple touch icon, PWA icons and maskable icons
- Open Graph / social share card (`/public/og-image.png`)

## Regenerating the PNGs and icons

`sharp` must be available (`npm i -D sharp` if it is not already installed).

```bash
npm run brand:build
```

That reads the source JPEGs above, keys out the background, writes
`/public/images/brand/*.png`, and regenerates the favicon, PWA icons and
`/public/og-image.png`.
