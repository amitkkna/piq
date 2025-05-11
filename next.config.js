/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Change from standalone to export for static site generation
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
