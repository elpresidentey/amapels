import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'icons')

const BG = '#0C0A08'
const GOLD = '#C4A35A'

// Elegant geometric "A" monogram: apex + two strokes + crossbar + serif feet
const glyph = `
  <g fill="none" stroke="${GOLD}" stroke-linecap="round">
    <path d="M256 138 L368 374" stroke-width="26"/>
    <path d="M256 138 L144 374" stroke-width="26"/>
    <path d="M188 310 H324" stroke-width="17"/>
    <path d="M120 374 H168" stroke-width="11"/>
    <path d="M344 374 H392" stroke-width="11"/>
  </g>`

const svg = ({ framed, scale = 1 }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(256,256) scale(${scale}) translate(-256,-256)">${glyph}</g>
  ${framed ? `<rect x="28" y="28" width="456" height="456" fill="none" stroke="${GOLD}" stroke-width="4" opacity="0.45"/>` : ''}
</svg>`

async function render(name, source, size) {
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(path.join(OUT, name))
  console.log(`  ${name} (${size}x${size})`)
}

await mkdir(OUT, { recursive: true })

console.log('Generating PWA icons...')
await render('icon-192.png', svg({ framed: true, scale: 0.92 }), 192)
await render('icon-512.png', svg({ framed: true, scale: 0.92 }), 512)
await render('maskable-192.png', svg({ framed: false, scale: 0.7 }), 192)
await render('maskable-512.png', svg({ framed: false, scale: 0.7 }), 512)
await render('apple-touch-icon.png', svg({ framed: false, scale: 0.8 }), 180)
await render('favicon.png', svg({ framed: false, scale: 0.9 }), 48)
console.log('Done.')
