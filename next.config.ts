import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Prevent browser from caching HTML with stale /_next asset URLs between HMR rebuilds */
  ...(isDev
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "no-store, no-cache, must-revalidate",
                },
              ],
            },
          ];
        },
        webpack: (config) => {
          config.watchOptions = {
            ...config.watchOptions,
            aggregateTimeout: 600,
            poll: 1000,
          };
          return config;
        },
      }
    : {}),
};

export default nextConfig;
