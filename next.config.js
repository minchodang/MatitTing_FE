/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.pixabay.com'],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
