


// next.config.js
/** @type {import('next').NextConfig} */

const nextConfig: import('next').NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // destination: 'http://192.168.0.101:3001/:path*',
        destination: 'http://backend:3001/:path*',
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['i.pinimg.com', "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
