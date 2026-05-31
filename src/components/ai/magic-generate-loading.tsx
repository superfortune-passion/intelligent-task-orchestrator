"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicGenerateLoadingProps {
  className?: string;
}

export function MagicGenerateLoading({ className }: MagicGenerateLoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-indigo-500/25 bg-indigo-500/8 px-4 py-3 magic-generate-pulse",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="AI is generating tasks"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg magic-gradient">
        <Sparkles className="h-5 w-5 text-white magic-sparkle-icon" aria-hidden />
        <span className="absolute inset-0 rounded-lg magic-generate-ring" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-sm font-medium text-indigo-100">
          Generating your execution plan…
        </p>
        <p className="text-xs text-muted-foreground">
          Building unique, project-specific tasks for To Do
        </p>
        <div className="flex gap-1 pt-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="magic-dot h-1.5 w-1.5 rounded-full bg-indigo-400"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
