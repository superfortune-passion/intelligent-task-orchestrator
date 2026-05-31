"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { ColumnEmptyState } from "@/components/kanban/column-empty-state";
import { TaskCardSkeleton } from "@/components/kanban/task-card-skeleton";
import { Button } from "@/components/ui/button";
import { columnIdFromStatus } from "@/types/task";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

const columnAccent: Record<TaskStatus, string> = {
  "To Do": "border-slate-500/30",
  "In Progress": "border-indigo-500/40",
  Review: "border-amber-500/40",
  Done: "border-emerald-500/40",
};

const columnDot: Record<TaskStatus, string> = {
  "To Do": "bg-slate-400",
  "In Progress": "bg-indigo-400",
  Review: "bg-amber-400",
  Done: "bg-emerald-400",
};

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  count: number;
  tasks: Task[];
  isLoading?: boolean;
  skeletonCount?: number;
  newTaskIds?: string[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  addTaskDisabled?: boolean;
}

export function KanbanColumn({
  title,
  status,
  count,
  tasks,
  isLoading = false,
  skeletonCount = 2,
  newTaskIds = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  addTaskDisabled = false,
}: KanbanColumnProps) {
  const columnId = columnIdFromStatus(status);
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-h-[280px] min-w-0 rounded-xl border border-border/50 bg-background/30 transition-all duration-300",
        "hover:border-border/70",
        columnAccent[status],
        isOver && "ring-2 ring-indigo-500/40 bg-indigo-500/8 scale-[1.01] shadow-lg shadow-indigo-500/10"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 shrink-0">
        <span className={cn("h-2 w-2 rounded-full shrink-0", columnDot[status])} />
        <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted rounded-md px-2 py-0.5 shrink-0 tabular-nums">
          {count}
        </span>
      </div>

      <div
        className="flex flex-col gap-2.5 p-3 flex-1 min-h-[180px] min-w-0"
        aria-busy={isLoading}
        aria-label={isLoading ? `Generating tasks for ${title}` : undefined}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isNew={newTaskIds.includes(task.id)}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task)}
          />
        ))}
        {isLoading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <TaskCardSkeleton key={`skeleton-${i}`} index={i} />
          ))}
        {!isLoading && tasks.length === 0 && (
          <ColumnEmptyState columnTitle={title} />
        )}
      </div>

      <div className="p-3 pt-0 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-dashed border-border/50 transition-all duration-200 hover:border-indigo-500/30"
          onClick={() => onAddTask(status)}
          disabled={addTaskDisabled}
        >
          <Plus className="h-4 w-4 shrink-0" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
