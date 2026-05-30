"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateExecutionPlan } from "@/services/ai-plan";
import { toast } from "@/hooks/use-toast";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

interface MagicGenerateProps {
  projectId: string;
  projectTitle: string;
}

type GenerateState = "idle" | "loading" | "error";

export function MagicGenerate({ projectId, projectTitle }: MagicGenerateProps) {
  const { createTasksBulk } = useApp();
  const [state, setState] = useState<GenerateState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const runGenerate = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const result = await generateExecutionPlan(projectTitle);

      if (!result.success) {
        setState("error");
        setErrorMessage(result.error);
        return;
      }

      createTasksBulk(
        projectId,
        result.tasks.map((t) => ({
          title: t.title,
          description: t.description,
          category: t.category,
          priority: "Medium" as const,
          dueDate: null,
        }))
      );

      setState("idle");
      toast({
        title: "Execution plan generated",
        description: `${result.tasks.length} tasks added to To Do.`,
        variant: "success",
      });
    } catch {
      setState("error");
      setErrorMessage(
        "An unexpected error occurred. Your data is safe — please retry."
      );
    }
  };

  if (state === "loading") {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg magic-gradient animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-3 w-64 max-w-full" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
        </div>
        <p className="text-xs text-indigo-300 animate-pulse shrink-0">
          Generating execution plan...
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
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
          onClick={runGenerate}
          className="shrink-0 border-red-500/30 hover:bg-red-500/10"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="magic"
      onClick={runGenerate}
      className={cn("gap-2 shadow-lg")}
    >
      <Sparkles className="h-4 w-4" />
      Generate Execution Plan
    </Button>
  );
}
