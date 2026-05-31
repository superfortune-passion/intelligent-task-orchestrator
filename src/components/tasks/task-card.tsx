"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskCardActions } from "@/components/tasks/task-card-actions";
import { formatDueDate } from "@/lib/date";
import {
  getCategoryBadgeVariant,
  getPriorityBadgeVariant,
  getPriorityDotClass,
} from "@/lib/task-badges";
import type { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  isNew?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
  isNew,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease, box-shadow 200ms ease",
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card rounded-lg p-3.5 group touch-manipulation relative min-h-[7.5rem]",
        dragging &&
          "opacity-90 shadow-2xl ring-2 ring-indigo-500/50 scale-[1.02] z-50",
        !dragging && "glass-card-hover",
        isNew && "task-enter ring-1 ring-indigo-500/30"
      )}
    >
      {!dragging && (
        <div
          className="absolute inset-x-0 top-0 h-8 rounded-t-lg bg-gradient-to-b from-indigo-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          aria-hidden
        />
      )}

      <div className="flex items-start gap-2 relative">
        <button
          type="button"
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          {...attributes}
          {...listeners}
          aria-label="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground line-clamp-2 break-words leading-snug pr-1">
              {task.title}
            </p>
            <TaskCardActions
              onEdit={onEdit}
              onDelete={onDelete}
              disabled={dragging}
            />
          </div>

          {task.description ? (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 break-words leading-relaxed">
              {task.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <Badge variant={getCategoryBadgeVariant(task.category)}>
              {task.category}
            </Badge>
            <Badge variant={getPriorityBadgeVariant(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <Calendar className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">
                {task.dueDate ? formatDueDate(task.dueDate) : "No due date"}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground"
              title={`${task.priority} priority`}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  getPriorityDotClass(task.priority)
                )}
                aria-hidden
              />
              <span className="hidden sm:inline">{task.priority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
