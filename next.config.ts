import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Prevent stale chunk references after HMR on Windows
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
