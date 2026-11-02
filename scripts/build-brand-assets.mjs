/**
 * Builds the transparent, theme-ready brand assets from the original logos.
 *
 * The supplied logo files are JPEGs with the background baked in (some gold on
 * black, some ink/gold on white). This script keys the flat background out into
 * a real alpha channel, trims the empty margins, and writes clean PNGs in the
 * brand colours so the site never has to invert or otherwise fake a logo.
 *
 * Run with: node scripts/build-brand-assets.mjs
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'public/images/brand')
const ICONS = path.join(ROOT, 'public/icons')

const INK = [0x12, 0x0f, 0x0b] // --color-ink (light theme)
const CREAM = [0xff, 0xfd, 0xf8] // --color-on-ink
const GOLD = [0xc4, 0xa3, 0x5a] // brand gold
const BRAND_BG = '#0c0a08'

const SOURCES = {
  markGold: { file: 'public/images/logo/amapels-mark-gold-on-black.jpg', bg: 'dark' },
  markInk: { file: 'public/images/logo/amapels-mark-ink-on-white.jpg', bg: 'light' },
  wordmarkGold: { file: 'public/images/logo/amapels-wordmark-gold-on-black.jpg', bg: 'dark' },
}

/** Read a JPEG and key its flat background out into an alpha channel. */
async function keyOut(src) {
  const { data, info } = await sharp(path.join(ROOT, src.file))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const count = width * height
  const alpha = new Uint8Array(count)

  if (src.bg === 'dark') {
    // pixel = alpha * foreground + (1 - alpha) * black
    let peak = 1
    for (let i = 0; i < count; i++) {
      const o = i * channels
      const m = Math.max(data[o], data[o + 1], data[o + 2])
      if (m > peak) peak = m
    }
    for (let i = 0; i < count; i++) {
      const o = i * channels
      const m = Math.max(data[o], data[o + 1], data[o + 2])
      alpha[i] = Math.round(Math.min(1, m / peak) * 255)
    }
  } else {
    // pixel = alpha * foreground + (1 - alpha) * white
    let floor = 255
    for (let i = 0; i < count; i++) {
      const o = i * channels
      const m = Math.min(data[o], data[o + 1], data[o + 2])
      if (m < floor) floor = m
    }
    const span = Math.max(1, 255 - floor)
    for (let i = 0; i < count; i++) {
      const o = i * channels
      const m = Math.min(data[o], data[o + 1], data[o + 2])
      alpha[i] = Math.round(Math.min(1, (255 - m) / span) * 255)
    }
  }

  return { width, height, alpha }
}

/** Trim transparent margins down to the artwork. */
function bounds({ width, height, alpha }, threshold = 14) {
  let left = width
  let top = height
  let right = -1
  let bottom = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > threshold) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  if (right < left || bottom < top) throw new Error('No artwork found')
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}

function paint({ width, height, alpha }, { left, top, width: w, height: h }, [r, g, b], boost = 1) {
  const out = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = Math.min(255, Math.round(alpha[(y + top) * width + (x + left)] * boost))
      const o = (y * w + x) * 4
      out[o] = r
      out[o + 1] = g
      out[o + 2] = b
      out[o + 3] = src
    }
  }
  return { data: out, width: w, height: h }
}

async function write(file, image, scale = 1) {
  let pipeline = sharp(image.data, {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
  if (scale > 1) {
    pipeline = pipeline.resize(
      Math.round(image.width * scale),
      Math.round(image.height * scale),
      { kernel: 'lanczos3' }
    )
  }
  const info = await pipeline.png({ compressionLevel: 9 }).toFile(path.join(OUT, file))
  console.log(`  ${file.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`)
  return info
}

async function buildLogos() {
  await mkdir(OUT, { recursive: true })
  console.log('Writing transparent logos →', path.relative(ROOT, OUT))

  const mark = await keyOut(SOURCES.markGold)
  const markBox = bounds(mark)
  const markAlpha = paint(mark, markBox, GOLD)
  await write('mark-gold.png', markAlpha)

  const inkMark = await keyOut(SOURCES.markInk)
  const inkBox = bounds(inkMark)
  await write('mark-ink.png', paint(inkMark, inkBox, INK))
  await write('mark-cream.png', paint(inkMark, inkBox, CREAM))

  const wordmark = await keyOut(SOURCES.wordmarkGold)
  const wordmarkBox = bounds(wordmark)
  // The supplied wordmark is small for a retina footer; 2× keeps it crisp.
  await write('wordmark-gold.png', paint(wordmark, wordmarkBox, GOLD), 2)
  await write('wordmark-ink.png', paint(wordmark, wordmarkBox, INK, 1.25), 2)
  await write('wordmark-cream.png', paint(wordmark, wordmarkBox, CREAM, 1.25), 2)
}

async function icon(size, padding, file) {
  const art = await sharp(path.join(OUT, 'mark-gold.png'))
    .resize({ width: Math.round(size * (1 - padding * 2)), fit: 'contain' })
    .toBuffer()
  const canvas = sharp({
    create: { width: size, height: size, channels: 4, background: BRAND_BG },
  })
  const info = await canvas
    .composite([{ input: art, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(ICONS, file))
  console.log(`  icons/${file.padEnd(20)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`)
}

async function buildIcons() {
  console.log('Writing PWA / launcher icons →', path.relative(ROOT, ICONS))
  await mkdir(ICONS, { recursive: true })
  await icon(512, 0.19, 'icon-512.png')
  await icon(192, 0.19, 'icon-192.png')
  await icon(512, 0.27, 'maskable-512.png')
  await icon(192, 0.27, 'maskable-192.png')
  await icon(180, 0.16, 'apple-touch-icon.png')
  await icon(48, 0.1, 'favicon.png')
}

async function buildSocialCard() {
  console.log('Writing social share card → public/og-image.png')
  const wordmark = await sharp(path.join(OUT, 'wordmark-gold.png'))
    .resize({ width: 760 })
    .toBuffer()
  const backdrop = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#2a2113" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#0c0a08" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#0c0a08"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <rect x="34" y="34" width="1132" height="562" fill="none" stroke="#c4a35a" stroke-opacity="0.35"/>
    </svg>`)
  const info = await sharp(backdrop)
    .composite([{ input: wordmark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public/og-image.png'))
  console.log(`  og-image.png               ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`)
}

await buildLogos()
await buildIcons()
await buildSocialCard()
console.log('Done.')
