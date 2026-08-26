import sharp from 'sharp'
import { readdir, unlink } from 'fs/promises'
import path from 'path'

const dir = 'public/images'
const files = await readdir(dir)
let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const src = path.join(dir, file)
  const dest = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'))
  const before = (await import('fs/promises')).stat(src).then(s => s.size)
  await sharp(src).webp({ quality: 82 }).toFile(dest)
  const sizeBefore = await before
  const sizeAfter = (await (await import('fs/promises')).stat(dest)).size
  totalBefore += sizeBefore
  totalAfter += sizeAfter
  await unlink(src)
  console.log(`${file} -> ${path.basename(dest)} (${(sizeBefore / 1024).toFixed(0)}KB -> ${(sizeAfter / 1024).toFixed(0)}KB)`)
}

console.log(`\nTotal: ${(totalBefore / 1048576).toFixed(2)}MB -> ${(totalAfter / 1048576).toFixed(2)}MB`)
