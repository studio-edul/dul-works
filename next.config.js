const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
// Force restart
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // GitHub Pages 배포를 위한 설정
  basePath: isProd ? '/dul-works' : '',
  assetPrefix: isProd ? '/dul-works' : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig

