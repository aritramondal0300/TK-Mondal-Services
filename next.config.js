/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  basePath: '/TK-Mondal-Services',
  assetPrefix: '/TK-Mondal-Services/',

  images: {
    unoptimized: true,
  },

  experimental: {
    turbo: {
      rules: {},
    },
  },
};

module.exports = nextConfig;