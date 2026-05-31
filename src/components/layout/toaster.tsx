"use client";

import { X, CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const variantStyles: Record<
  NonNullable<Toast["variant"]>,
  {
    bar: string;
    iconWrap: string;
    icon: typeof CheckCircle2;
    iconClass: string;
    glow: string;
  }
> = {
  success: {
    bar: "bg-emerald-400",
    iconWrap: "bg-emerald-500/20 border-emerald-500/40",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    glow: "shadow-[0_0_28px_rgba(52,211,153,0.25)]",
  },
  destructive: {
    bar: "bg-red-400",
    iconWrap: "bg-red-500/20 border-red-500/40",
    icon: AlertCircle,
    iconClass: "text-red-400",
    glow: "shadow-[0_0_28px_rgba(248,113,113,0.25)]",
  },
  info: {
    bar: "bg-indigo-400",
    iconWrap: "bg-indigo-500/20 border-indigo-500/40",
    icon: Info,
    iconClass: "text-indigo-400",
    glow: "shadow-[0_0_28px_rgba(99,102,241,0.25)]",
  },
  default: {
    bar: "bg-slate-400",
    iconWrap: "bg-slate-500/20 border-slate-500/40",
    icon: Sparkles,
    iconClass: "text-slate-300",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.15)]",
  },
};

function ToastCard({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const variant = t.variant ?? "default";
  const style = variantStyles[variant];
  const Icon = style.icon;
  const duration = t.duration ?? 5500;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-xl border backdrop-blur-xl",
        "animate-in slide-in-from-bottom-4 fade-in zoom-in-95 duration-300",
        "min-w-[min(100%,20rem)] max-w-sm",
        style.glow,
        variant === "success" &&
          "border-emerald-500/35 bg-[#0a121f]/95",
        variant === "destructive" &&
          "border-red-500/35 bg-[#0a121f]/95",
        variant === "info" && "border-indigo-500/35 bg-[#0a121f]/95",
        variant === "default" && "border-border/50 bg-[#0a121f]/95"
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", style.bar)} />

      <div className="flex gap-3 p-4 pl-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
            style.iconWrap
          )}
        >
          <Icon className={cn("h-5 w-5", style.iconClass)} aria-hidden />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          {t.title && (
            <p className="text-sm font-semibold text-foreground leading-snug">
              {t.title}
            </p>
          )}
          {t.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3 break-words">
              {t.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30"
        aria-hidden
      >
        <div
          className={cn("h-full origin-left", style.bar)}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed z-[100] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none
        bottom-6 left-1/2 -translate-x-1/2
        sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-6"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
