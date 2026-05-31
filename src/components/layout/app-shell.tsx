"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/layout/toaster";
import { Button } from "@/components/ui/button";
import { AppProvider } from "@/components/providers/app-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ChunkLoadRecovery } from "@/components/dev/chunk-load-recovery";
import { StyleBootComplete } from "@/components/dev/style-boot-complete";
import { ShellGate } from "@/components/layout/shell-gate";

const SIDEBAR_KEY = "ito-sidebar-collapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(readCollapsed());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed, mounted]);

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  return (
    <ThemeProvider>
      <AppProvider>
        <StyleBootComplete />
        <ChunkLoadRecovery />
        <ShellGate>
        <div className="min-h-screen" data-ito-shell>
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <div
            className={`main-surface app-gradient transition-all duration-300 ease-out min-h-screen ${
              sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
            }`}
          >
            <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/50 bg-background/90 backdrop-blur-xl px-4 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="text-sm font-semibold truncate min-w-0 flex-1">
                Intelligent Task Orchestrator
              </span>
              <ThemeToggle inSidebar={false} className="w-auto shrink-0" />
            </header>
            <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen min-w-0 overflow-x-hidden">
              {children}
            </main>
          </div>
          <Toaster />
        </div>
        </ShellGate>
      </AppProvider>
    </ThemeProvider>
  );
}
