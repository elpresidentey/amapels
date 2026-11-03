/**
 * Seeds the AMAPELS journal with the store's guide post.
 *
 * Reads MONGODB_URI from .env (same source as the Next.js app) and inserts
 * the post into the same collection the app reads through /api/blog.
 * Idempotent: re-running updates the existing post by slug instead of
 * duplicating it.
 *
 * Usage: node scripts/seed-blog-post.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'

const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.error('No .env file found in this directory.')
  process.exit(1)
}
const env = fs.readFileSync(envPath, 'utf8')
const match = env.match(/^MONGODB_URI=(.*)$/m)
if (!match) {
  console.error('MONGODB_URI is not set in .env')
  process.exit(1)
}
const uri = match[1].trim().replace(/^["']|["']$/g, '')

const POST = {
  title: 'How to Choose Jewellery That Never Tarnishes (5 Checks Before You Buy)',
  slug: 'jewellery-that-never-tarnishes',
  excerpt:
    'Green marks after two wears? Chains gone dull by the next owambe? Here are the five-minute checks that tell you whether jewellery will last — before you pay for it.',
  author: 'AMAPELS',
  category: 'Style Tips',
  image: '/images/pexels-sheilabox-235376934-12184920.webp',
  tags: ['jewellery care', 'style tips', 'gifting'],
  published: true,
  // One line = one paragraph in the journal renderer.
  content: [
    'You know the disappointment. Earrings you loved on Monday are dull by Wednesday, and by the second wear of the weekend there is a green mark where the chain sat. It is not your skin. It is not bad luck. It is what the piece is made of.',
    'Almost every gold-looking jewellery sold around you is plated — a layer of real gold over a base metal. Plating itself is not the problem; cheap plating is. When the layer is too thin, sweat, perfume and harmattan dust wear through it in weeks, and the metal underneath reacts with your skin.',
    'So before you buy any piece — online, in the market, or as a gift — run these five quick checks. They take less than five minutes and they will save you more money than any discount ever will.',
    'One: let the price speak first. Stainless steel, titanium and properly thick 18k plating cost money to make. If a "gold" piece costs less than lunch, the gold is probably a rumour. That is fine for a one-night outfit — just do not buy it as an everyday piece.',
    'Two: bring a small magnet. Stainless steel, titanium and gold are not magnetic. If a supposed steel or gold piece sticks to the magnet in your bag, what you are holding is mostly something else.',
    'Three: read the finish, not the vibe. "18k gold plated" means something. "Gold-tone", "gold colour" and "painted gold" mean nothing — those are colours, not materials. Ask for the base metal (stainless steel or brass) and how thick the plating is. A seller who knows their products will answer without blinking.',
    'Four: do the 72-hour wear test. Wear the piece to work, through traffic, through one proper bath. If your skin is still clean and the colour still holds, it has passed the test that matters — real life, not the display shelf.',
    'Five: ask what happens after. Who do you call if the clasp gives way in two months? A seller that stands behind what they sell will happily tell you how their pieces behave after weeks of wear, not just how they look under shop light.',
    'This is exactly why AMAPELS started the way it did. Every piece we list is worn, checked and approved by us first — no green skin, no dull chains, no surprises after the wedding. If we would not wear it to the office, to church and to an owambe in the same week, we do not sell it.',
    'Start with one piece you will actually wear every day — a plain chain, small studs, a bangle that goes with everything. Build from there. When you are ready to shop, we have already done the checking for you: start at amapelsng.com/shop, and turn on email updates at checkout so you hear about new arrivals first.',
  ].join('\n'),
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: 'AMAPELS' },
    category: { type: String, default: 'News' },
    image: { type: String, default: '' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
)

// Match the app's model so the collection name resolves identically.
const BlogPost =
  mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)

try {
  await mongoose.connect(uri)
  const existing = await BlogPost.findOne({ slug: POST.slug })
  if (existing) {
    await BlogPost.updateOne({ slug: POST.slug }, { $set: POST })
    console.log(`Updated existing post "${POST.title}" (slug: ${POST.slug})`)
  } else {
    await BlogPost.create({ ...POST, publishedAt: new Date() })
    console.log(`Created post "${POST.title}" (slug: ${POST.slug})`)
  }
} catch (error) {
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
