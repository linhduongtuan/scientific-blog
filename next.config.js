/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow GitHub avatar images
  },
  // For development, keep dynamic features enabled
  // For production static export, uncomment the following:
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
}

module.exports = nextConfig