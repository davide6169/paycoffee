/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: true,
  },

  // Enable static export for deployment
  output: 'export',

  // Trailing slash handling
  trailingSlash: true,

  // Turbopack configuration (empty for now)
  turbopack: {},
};

module.exports = nextConfig;
