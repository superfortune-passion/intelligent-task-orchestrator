import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { DEV_ASSET_RECOVERY_SCRIPT } from "@/lib/dev-asset-recovery";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} | ${APP_TAGLINE}`,
  description:
    "AI-powered execution planning platform. Transform project ideas into structured Kanban workflows.",
};

/** Minimal theme if Tailwind chunk fails to load during dev HMR (prevents white unstyled flash) */
const criticalCss = `
  html { color-scheme: dark; }
  body {
    margin: 0;
    background-color: #070b14;
    color: #e8ecf4;
    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  a { color: #a5b4fc; }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        {process.env.NODE_ENV === "development" ? (
          <script
            dangerouslySetInnerHTML={{ __html: DEV_ASSET_RECOVERY_SCRIPT }}
          />
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
