import type { NextConfig } from "next";

/** Keep config minimal — custom webpack + Turbopack together causes ENOENT/500 on Windows dev refresh */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
