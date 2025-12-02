import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agribegri.com',
      },
      {
        protocol: 'https',
        hostname: 'dujjhct8zer0r.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
