"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme, useThemeMounted } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  collapsed?: boolean;
  className?: string;
  /** When true, styles for dark sidebar; when false, main header */
  inSidebar?: boolean;
}

export function ThemeToggle({
  collapsed,
  className,
  inSidebar = true,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useThemeMounted();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        inSidebar
          ? "sidebar-nav-item text-[var(--sb-muted)] hover:text-[var(--sb-fg)] hover:bg-[var(--sb-hover)]"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        collapsed && "justify-center px-2",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {mounted ? (
        isDark ? (
          <Sun className={cn("h-4 w-4 shrink-0", inSidebar && "text-amber-400")} />
        ) : (
          <Moon className={cn("h-4 w-4 shrink-0", inSidebar && "text-indigo-300")} />
        )
      ) : (
        <Sun className="h-4 w-4 shrink-0 opacity-50" />
      )}
      {!collapsed && (
        <span className="truncate">
          {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
        </span>
      )}
    </button>
  );
}
