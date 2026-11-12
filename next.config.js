/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve images directly from Supabase instead of Vercel's optimizer.
    // Vercel returns 402 once its image-optimization quota runs out, which
    // left new product images (e.g. Bilkisu Tennis, Larai silver) blank.
    unoptimized: true,
  },
  async redirects() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amapelsng.com'
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'amapels.vercel.app',
          },
        ],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'amapels-ekenes-projects-c0862f30.vercel.app',
          },
        ],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
