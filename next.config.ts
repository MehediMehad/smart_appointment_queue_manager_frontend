// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:7099/:path*"
            : "https://smart-appointment-queue-manager-gwawn5tov.vercel.app/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "advocatoriowebclick.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

