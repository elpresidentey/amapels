/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
