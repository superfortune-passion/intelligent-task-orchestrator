import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { STYLE_BOOT_SCRIPT } from "@/lib/style-boot-script";
import { THEME_INIT_SCRIPT } from "@/lib/theme-init-script";

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

/** Inline — hides broken layout until Tailwind is ready (never show link soup) */
const criticalCss = `
  html.dark { color-scheme: dark; }
  html.light { color-scheme: light; }
  html.ito-boot-pending,
  html:not(.ito-styles-ready) { background: #f4f4f5; }
  html.dark.ito-boot-pending,
  html.dark:not(.ito-styles-ready) { background: #070b14; }
  html:not(.ito-styles-ready) [data-ito-shell] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  body {
    margin: 0;
    overflow-x: hidden;
    background-color: var(--background, #f4f4f5);
    color: var(--foreground, #1c1c1e);
    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  html.ito-boot-pending::before,
  html:not(.ito-styles-ready):not(.ito-boot-failed)::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    background: inherit;
  }
  html.ito-boot-pending::after,
  html:not(.ito-styles-ready):not(.ito-boot-failed)::after {
    content: "";
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 2147483647;
    width: 2rem;
    height: 2rem;
    margin: -1rem 0 0 -1rem;
    border: 2px solid rgba(120, 130, 150, 0.25);
    border-top-color: #5c6b82;
    border-radius: 50%;
    animation: ito-spin 0.7s linear infinite;
  }
  @keyframes ito-spin { to { transform: rotate(360deg); } }
  html.ito-boot-failed::after {
    content: "Styles failed to load. Stop the server, run npm run dev:fresh, then refresh.";
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    font: 14px/1.5 system-ui, sans-serif;
    color: #52525b;
    width: auto;
    height: auto;
    margin: 0;
    border: none;
    animation: none;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light ito-boot-pending" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <script dangerouslySetInnerHTML={{ __html: STYLE_BOOT_SCRIPT }} />
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
