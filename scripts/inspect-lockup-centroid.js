const sharp = require('sharp')
const file = 'C:/Users/hp/Downloads/WhatsApp Image 2026-11-01 at 2.48.13 PM.jpeg'

;(async () => {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, channels } = info
  const regions = { mark: { y0: 260, y1: 461 }, word: { y0: 482, y1: 528 } }
  for (const [name, r] of Object.entries(regions)) {
    let sum = 0, sx = 0, sy = 0, minX = 1e9, maxX = -1
    for (let y = r.y0; y <= r.y1; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels
        const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
        const a = Math.max(0, Math.min(1, (160 - l) / 120))
        if (a > 0.02) {
          sum += a; sx += x * a; sy += y * a
          if (x < minX) minX = x
          if (x > maxX) maxX = x
        }
      }
    }
    console.log(name, { centroidX: (sx / sum).toFixed(2), centroidY: (sy / sum).toFixed(2), minX, maxX, bboxCenter: (minX + maxX) / 2 })
  }
})()
