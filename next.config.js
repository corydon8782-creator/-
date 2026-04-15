/** @type {import('next').NextConfig} */
const { setupDevPlatform } = process.env.NODE_ENV === 'development'
  ? require('@cloudflare/next-on-pages/next-dev')
  : { setupDevPlatform: async () => {} }

const nextConfig = {
  reactStrictMode: true,
}

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform()
}

module.exports = nextConfig
