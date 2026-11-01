const sharp = require('sharp')

const files = {
  goldMarkWhite: 'C:/Users/hp/Downloads/WhatsApp Image 2026-11-01 at 2.49.12 P.jpeg',
  goldWordBlack: 'C:/Users/hp/Downloads/WhatsApp Image 2026-11-01 at 2.49.12 PM.jpeg',
  inkLockupGrid: 'C:/Users/hp/Downloads/WhatsApp Image 2026-11-01 at 2.48.13 PM.jpeg',
}

async function inspect(name, file) {
  const img = sharp(file).removeAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = -1, maxY = -1
  const samples = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i], g = data[i + 1], b = data[i + 2]
      // background is near-white or near-black; treat any strong deviation as content
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const isContent = (name === 'goldMarkWhite')
        ? (Math.min(255 - r, 255 - g, 255 - b) > 14)
        : (name === 'goldWordBlack')
          ? (l > 40)
          : (l < 160)
      if (isContent) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
        if (samples.length < 400000 && (x + y) % 7 === 0) samples.push([r, g, b])
      }
    }
  }
  // modal color among samples
  const counts = new Map()
  for (const [r, g, b] of samples) {
    const key = `${r},${g},${b}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  console.log(JSON.stringify({ name, width, height, box: { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 }, top }, null, 2))
}

;(async () => {
  for (const [name, file] of Object.entries(files)) await inspect(name, file)
})()
