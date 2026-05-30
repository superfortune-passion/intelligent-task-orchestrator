import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Production builds only; dev uses Turbopack (see scripts/dev-fresh.js)
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
