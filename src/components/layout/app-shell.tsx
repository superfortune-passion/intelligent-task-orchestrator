"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/layout/toaster";
import { Button } from "@/components/ui/button";
import { AppProvider } from "@/components/providers/app-provider";
import { ChunkLoadRecovery } from "@/components/dev/chunk-load-recovery";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppProvider>
      <ChunkLoadRecovery />
      <div className="app-gradient min-h-screen" data-ito-shell>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
          }`}
        >
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm font-semibold truncate min-w-0">
              Intelligent Task Orchestrator
            </span>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </AppProvider>
  );
}
