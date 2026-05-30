"use client";

import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date";
import { MoreHorizontal, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  completedCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({
  project,
  taskCount,
  completedCount,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const progress =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 group relative">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${project.color}22` }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
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

      <Link href={`/projects/${project.id}`} className="block group/link">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover/link:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4">
          {project.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </span>
          <span>{formatDistanceToNow(project.updatedAt)}</span>
        </div>
        {taskCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-indigo-300 font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500")}
                style={{
                  width: `${progress}%`,
                  backgroundColor: project.color,
                }}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Open workspace
          <ArrowUpRight className="h-3 w-3" />
        </div>
      </Link>
    </div>
  );
}
