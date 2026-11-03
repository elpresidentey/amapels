/**
 * Publishes the AMAPELS guide post through the production blog API.
 *
 * Logs in with the admin credentials from .env.vercel.local (pulled from
 * Vercel), then POSTs the post to /api/blog with the session cookie.
 * Secrets are never printed.
 *
 * Usage: node scripts/publish-blog-post.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const envPath = path.join(process.cwd(), '.env.vercel.local')
if (!fs.existsSync(envPath)) {
  console.error('No .env.vercel.local file — run `vercel env pull .env.vercel.local` first.')
  process.exit(1)
}
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => /^([A-Z_0-9]+)="?([^"]*)"?$/.test(line))
    .map((line) => {
      const [, key, value] = /([A-Z_0-9]+)="?(.*?)"?$/.exec(line)
      return [key, value]
    })
)

const BASE_URL = env.NEXT_PUBLIC_SITE_URL || 'https://amapelsng.com'
const { ADMIN_EMAIL, ADMIN_PASSWORD } = env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL / ADMIN_PASSWORD not found in .env.vercel.local')
  process.exit(1)
}

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

function logRedacted(label, value) {
  console.log(`${label}: ${value}`)
}

try {
  // 1. Login (credentials stay in this process; never printed)
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  logRedacted('login status', loginRes.status)
  if (!loginRes.ok) {
    console.error(await loginRes.text())
    process.exit(1)
  }
  const setCookie = loginRes.headers.get('set-cookie') || ''
  if (!setCookie) {
    console.error('No session cookie returned by login')
    process.exit(1)
  }

  // 2. Publish the post (409 => already exists, which is fine on re-runs)
  const postRes = await fetch(`${BASE_URL}/api/blog`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: setCookie },
    body: JSON.stringify(POST),
  })
  logRedacted('publish status', postRes.status)
  const body = await postRes.json().catch(() => ({}))
  if (postRes.status === 409) {
    console.log(`Post already exists (slug: ${POST.slug}) — nothing to do.`)
  } else if (!postRes.ok) {
    console.error('Publish failed:', JSON.stringify(body))
    process.exit(1)
  } else {
    console.log(`Created post with id: ${body?.post?.id || 'unknown'}`)
    console.log(`post title: ${body?.post?.title || POST.title}`)
  }

  // 3. Verify it is live
  const verifyRes = await fetch(`${BASE_URL}/api/blog/slug/${POST.slug}`)
  logRedacted('verify status', verifyRes.status)
  if (verifyRes.ok) {
    const { post } = await verifyRes.json()
    console.log(`Live at ${BASE_URL}/journal/${post.slug} (published: ${post.published})`)
  } else {
    console.error('Verification fetch failed')
    process.exitCode = 1
  }
} catch (error) {
  console.error('Publishing failed:', error.message)
  process.exitCode = 1
}
