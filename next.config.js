/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: true,
  },

  // Turbopack configuration (empty for now)
  turbopack: {},
};

module.exports = nextConfig;
