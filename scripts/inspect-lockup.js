const sharp = require('sharp')
const file = 'C:/Users/hp/Downloads/WhatsApp Image 2026-11-01 at 2.48.13 PM.jpeg'

;(async () => {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const rows = []
  const cols = []
  for (let y = 0; y < height; y++) {
    let count = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      if (l < 160) count++
    }
    if (count > 0) rows.push({ y, count })
  }
  for (let x = 0; x < width; x++) {
    let count = 0
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * channels
      const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      if (l < 160) count++
    }
    if (count > 0) cols.push({ x, count })
  }
  // find row bands
  const bands = []
  let start = null
  for (let y = 0; y < height; y++) {
    const has = rows.some(r => r.y === y)
    if (has && start === null) start = y
    if (!has && start !== null) { bands.push([start, y - 1]); start = null }
  }
  if (start !== null) bands.push([start, height - 1])
  console.log('row bands', bands)
  for (const [a, b] of bands) {
    let minX = width, maxX = -1
    for (let y = a; y <= b; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels
        const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
        if (l < 160) { minX = Math.min(minX, x); maxX = Math.max(maxX, x) }
      }
    }
    console.log(`band ${a}-${b} (h=${b - a + 1}) x:${minX}-${maxX} (w=${maxX - minX + 1})`)
  }
  console.log('row profile transitions sample', rows.slice(0, 5), rows.slice(-5))
})()
