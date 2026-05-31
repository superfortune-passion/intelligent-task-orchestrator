"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TaskCardActions } from "@/components/tasks/task-card-actions";
import { formatDueDate } from "@/lib/date";
import {
  getCategoryBadgeVariant,
  getPriorityBadgeVariant,
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

function assigneeInitials(taskId: string): string {
  const code = taskId.charCodeAt(0) + taskId.charCodeAt(taskId.length - 1);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return letters[code % letters.length] + letters[(code * 3) % letters.length];
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
        "glass-card rounded-lg p-3.5 group touch-manipulation relative",
        dragging &&
          "opacity-90 shadow-2xl ring-2 ring-indigo-500/50 scale-[1.02] z-50",
        !dragging &&
          "glass-card-hover hover:shadow-lg hover:shadow-indigo-500/10",
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
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none shrink-0"
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
            <div className="flex items-center gap-3 min-w-0">
              {task.dueDate ? (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                  <Calendar className="h-3 w-3" aria-hidden />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
              ) : (
                <span className="text-[11px] text-muted-foreground/60">
                  No due date
                </span>
              )}
              <button
                type="button"
                className="flex items-center gap-0.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                aria-label="Comments (coming soon)"
                tabIndex={-1}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="text-[10px]">0</span>
              </button>
            </div>
            <Avatar className="h-6 w-6 shrink-0 ring-1 ring-border/60">
              <AvatarFallback className="text-[9px] bg-indigo-500/25 text-indigo-200">
                {assigneeInitials(task.id)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
