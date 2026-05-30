"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDueDate } from "@/lib/date";
import type { Task, TaskCategory, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";

const categoryVariant: Record<TaskCategory, "research" | "planning" | "marketing" | "operations" | "review" | "design" | "development" | "general"> = {
  Research: "research",
  Planning: "planning",
  Marketing: "marketing",
  Operations: "operations",
  Review: "review",
  Design: "design",
  Development: "development",
  General: "general",
};

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
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
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card rounded-lg p-3.5 group touch-manipulation",
        dragging && "opacity-50 shadow-2xl ring-2 ring-indigo-500/40 scale-[1.02]",
        !dragging && "glass-card-hover"
      )}
    >
      <div className="flex items-start gap-2">
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
            <p className="text-sm font-medium text-foreground line-clamp-2 break-words">
              {task.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <Badge variant={categoryVariant[task.category]}>
              {task.category}
            </Badge>
            <Badge variant={task.priority as TaskPriority}>
              {task.priority}
            </Badge>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDueDate(task.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
