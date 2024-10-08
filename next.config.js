/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config, { isServer }) => {
    // Use Babel instead of SWC
    config.resolve.alias = {
      ...config.resolve.alias,
      '@swc/helpers': require.resolve('@swc/helpers'),
    };
    return config;
  },
}

module.exports = nextConfig