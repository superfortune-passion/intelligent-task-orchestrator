import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Removes the bottom-left "N" dev badge that overlaps the sidebar */
  devIndicators: false,
  /** Prevent stale HTML/CSS/JS mismatches on refresh during dev */
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
            {
              source: "/_next/static/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "no-store, no-cache, must-revalidate",
                },
              ],
            },
          ];
        },
        webpack: (config, { dev }) => {
          if (dev) {
            config.watchOptions = {
              ...config.watchOptions,
              aggregateTimeout: 800,
              poll: 1000,
            };
          }
          return config;
        },
      }
    : {}),
};

export default nextConfig;
