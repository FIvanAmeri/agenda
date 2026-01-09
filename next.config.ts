import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/registro',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;