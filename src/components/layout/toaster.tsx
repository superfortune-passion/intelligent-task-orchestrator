"use client";

import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto glass-card rounded-lg p-4 shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-300 flex gap-3",
            t.variant === "destructive" && "border-red-500/30",
            t.variant === "success" && "border-emerald-500/30"
          )}
        >
          {t.variant === "success" && (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          )}
          {t.variant === "destructive" && (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {t.title && (
              <p className="text-sm font-medium text-foreground">{t.title}</p>
            )}
            {t.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
