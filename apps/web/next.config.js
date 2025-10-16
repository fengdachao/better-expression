/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@better-sentence/core', '@better-sentence/ui'],
  experimental: {
    optimizePackageImports: ['@better-sentence/ui']
  }
}

module.exports = nextConfig
