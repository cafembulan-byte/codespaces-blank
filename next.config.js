/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['sqlite3'],
  },
}

module.exports = nextConfig
