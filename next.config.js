/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Removed redundant webpack rule
  compress: true,
  swcMinify: true, // Faster prod builds
  // output: 'export', // Uncomment for static export
};

module.exports = nextConfig;
