"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  className?: string;
}

export function TaskCardActions({
  onEdit,
  onDelete,
  disabled,
  className,
}: TaskCardActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 shrink-0",
        "opacity-0 translate-x-1 pointer-events-none",
        "group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto",
        "group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:pointer-events-auto",
        "max-sm:opacity-100 max-sm:translate-x-0 max-sm:pointer-events-auto",
        "transition-all duration-200 ease-out",
        disabled && "hidden",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="icon-touch text-muted-foreground hover:text-indigo-300 hover:bg-indigo-500/15"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Edit task"
        title="Edit task"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="icon-touch text-muted-foreground hover:text-red-400 hover:bg-red-500/15"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete task"
        title="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="icon-touch text-muted-foreground hover:text-foreground hover:bg-muted/60"
            aria-label="Task actions menu"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[11rem] border-border/60 bg-popover/95 backdrop-blur-xl"
        >
          <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Task actions
          </p>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="gap-2 cursor-pointer focus:bg-indigo-500/15"
          >
            <Pencil className="h-4 w-4 text-indigo-400" />
            <span>Edit task</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="gap-2 cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/15"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete task</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
