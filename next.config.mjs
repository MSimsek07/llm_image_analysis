/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    domains: ['example.com'],
    path: '/_next/image',
    loader: 'default',
  },
};

export default nextConfig;
