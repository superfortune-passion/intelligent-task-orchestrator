"use client";

import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCardActionsProps {
  projectTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function ProjectCardActions({
  projectTitle,
  onEdit,
  onDelete,
  className,
}: ProjectCardActionsProps) {
  return (
    <div className={cn("flex items-center gap-1 shrink-0", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
      >
        <Pencil className="h-3.5 w-3.5 mr-1" />
        Edit
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2.5 text-xs text-red-400/90 hover:text-red-300 hover:bg-red-500/10 hidden sm:inline-flex"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Delete
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:hidden"
            aria-label={`Actions for ${projectTitle}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-400 focus:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
