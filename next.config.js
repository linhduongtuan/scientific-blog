/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow GitHub avatar images
    // unoptimized: true, // Uncomment if using static export
  },
  eslint: {
    ignoreDuringBuilds: true, // TEMPORARY - fix after deployment
  },
  // For production static export, uncomment the following:
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
