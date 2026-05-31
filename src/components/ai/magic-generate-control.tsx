"use client";

import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { MagicGenerateLoading } from "@/components/ai/magic-generate-loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MagicGenerateState } from "@/hooks/use-magic-generate";

interface MagicGenerateControlProps {
  state: MagicGenerateState;
  errorMessage: string;
  onGenerate: () => void;
  disabled?: boolean;
  className?: string;
}

export function MagicGenerateControl({
  state,
  errorMessage,
  onGenerate,
  disabled,
  className,
}: MagicGenerateControlProps) {
  const isLoading = state === "loading";

  return (
    <div className={cn("flex flex-col gap-3 w-full sm:w-auto", className)}>
      {isLoading ? (
        <MagicGenerateLoading />
      ) : (
        <Button
          variant="magic"
          onClick={onGenerate}
          disabled={disabled}
          className="gap-2 shadow-lg shrink-0 w-full sm:w-auto"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <span>Magic Generate</span>
        </Button>
      )}

      {state === "error" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 animate-in fade-in duration-300">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-300">Generation failed</p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words">
                {errorMessage}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerate}
            className="shrink-0 border-red-500/30 hover:bg-red-500/10 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

    </div>
  );
}
