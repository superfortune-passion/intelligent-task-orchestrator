"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border/60 bg-[#050810]/95 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/60 px-4",
            collapsed && "justify-center px-2"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 rounded-lg transition-opacity duration-200 hover:opacity-90"
            onClick={onMobileClose}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg magic-gradient shadow-lg shadow-indigo-500/20 transition-shadow duration-300 hover:shadow-indigo-500/35">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  ITO
                </p>
                <p className="truncate text-[10px] text-muted-foreground leading-tight">
                  {APP_NAME.split(" ").slice(-2).join(" ")}
                </p>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                data-active={isActive}
                className={cn(
                  "nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-3 space-y-2">
          {!collapsed && (
            <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 transition-colors duration-200 hover:border-indigo-500/30">
              <p className="text-xs font-medium text-indigo-300">AI Powered</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Generate execution plans from project ideas in seconds.
              </p>
            </div>
          )}
          <button
            type="button"
            className={cn(
              "nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground",
              collapsed && "justify-center"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex w-full hover:bg-muted/80"
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
