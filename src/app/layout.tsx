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

/** Fallback if Tailwind chunk is delayed — matches design tokens */
const criticalCss = `
  html.dark { color-scheme: dark; }
  html.light { color-scheme: light; }
  html.ito-boot-pending { background: #070b14; }
  html.light.ito-boot-pending { background: #f8fafc; }
  html.dark.ito-boot-pending { background: #070b14; }
  body {
    margin: 0;
    background-color: var(--background, #f8fafc);
    color: var(--foreground, #0f172a);
    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
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
