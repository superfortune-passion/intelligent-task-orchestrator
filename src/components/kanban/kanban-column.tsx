"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "@/components/tasks/task-card";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

const columnAccent: Record<TaskStatus, string> = {
  todo: "border-slate-500/30",
  in_progress: "border-indigo-500/40",
  review: "border-amber-500/40",
  done: "border-emerald-500/40",
};

const columnDot: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-indigo-400",
  review: "bg-amber-400",
  done: "bg-emerald-400",
};

interface KanbanColumnProps {
  id: string;
  title: string;
  status: TaskStatus;
  count: number;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function KanbanColumn({
  id,
  title,
  status,
  count,
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-h-[200px] rounded-xl border border-border/50 bg-background/30 transition-colors duration-200",
        columnAccent[status],
        isOver && "ring-2 ring-indigo-500/30 bg-indigo-500/5"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
        <span className={cn("h-2 w-2 rounded-full", columnDot[status])} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted rounded-md px-2 py-0.5">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 p-3 flex-1">
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 px-2">
            Drop tasks here
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}
