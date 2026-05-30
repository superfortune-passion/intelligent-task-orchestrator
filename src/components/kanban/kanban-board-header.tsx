"use client";

import { Plus, LayoutGrid } from "lucide-react";
import { MagicGenerateControl } from "@/components/ai/magic-generate-control";
import { Button } from "@/components/ui/button";
import type { MagicGenerateState } from "@/hooks/use-magic-generate";

interface KanbanBoardHeaderProps {
  taskCount: number;
  magicState: MagicGenerateState;
  magicError: string;
  onMagicGenerate: () => void;
  onAddTask: () => void;
  isGenerating: boolean;
}

export function KanbanBoardHeader({
  taskCount,
  magicState,
  magicError,
  onMagicGenerate,
  onAddTask,
  isGenerating,
}: KanbanBoardHeaderProps) {
  return (
    <div className="mb-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/25 shrink-0">
            <LayoutGrid className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              Execution Board
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {taskCount} task{taskCount !== 1 ? "s" : ""}
              {isGenerating ? " · Generating plan..." : " · Drag cards to update status"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2 shrink-0">
          <MagicGenerateControl
            state={magicState}
            errorMessage={magicError}
            onGenerate={onMagicGenerate}
            disabled={isGenerating}
          />
          <Button
            variant="outline"
            onClick={onAddTask}
            disabled={isGenerating}
            className="gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {isGenerating && (
        <p className="text-xs text-indigo-300/90 flex items-center gap-2 animate-pulse">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
          AI is building 5 categorized tasks for your To Do column...
        </p>
      )}
    </div>
  );
}
