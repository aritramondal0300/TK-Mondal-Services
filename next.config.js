/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === 'development') {
  import('@cloudflare/next-on-pages/next-dev').then(({ setupDevPlatform }) => {
    setupDevPlatform();
  }).catch(e => {
    console.error('Failed to setup Cloudflare Dev Platform:', e);
  });
}

module.exports = nextConfig;