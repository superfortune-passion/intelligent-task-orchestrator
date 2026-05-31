"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

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
          "ito-sidebar fixed left-0 top-0 z-50 flex h-full flex-col border-r backdrop-blur-xl transition-all duration-300 ease-out shadow-xl shadow-black/20",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-[var(--sb-border)] gap-1",
            collapsed ? "justify-center px-2" : "px-3"
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 min-w-0 rounded-lg transition-opacity duration-200 hover:opacity-90",
              collapsed ? "justify-center" : "flex-1"
            )}
            onClick={onMobileClose}
            title="ITO — Dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg magic-gradient shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="ito-sidebar-title truncate text-sm font-semibold">
                  ITO
                </p>
                <p className="ito-sidebar-subtitle truncate text-[10px] leading-tight">
                  {APP_NAME.split(" ").slice(-2).join(" ")}
                </p>
              </div>
            )}
          </Link>

          {onToggle && !collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 shrink-0 text-[var(--sb-muted)] hover:text-[var(--sb-fg)] hover:bg-[var(--sb-hover)]"
              onClick={onToggle}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
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
                  "sidebar-nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
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

        <div className="border-t border-[var(--sb-border)] p-3 space-y-2">
          <ThemeToggle collapsed={collapsed} />
          {onToggle && (
            <Button
              type="button"
              variant="outline"
              className={cn(
                "hidden lg:flex w-full gap-2 border-[var(--sb-border)] bg-[var(--sb-hover)] text-[var(--sb-fg)] hover:bg-[var(--sb-active-bg)] hover:border-indigo-500/40",
                collapsed ? "justify-center px-0" : "justify-start"
              )}
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 shrink-0 text-indigo-300" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
              )}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
