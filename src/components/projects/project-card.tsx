"use client";

import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date";
import { getProjectAccentColor } from "@/lib/project-color";
import { ProjectCardActions } from "@/components/projects/project-card-actions";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
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
  const accent = getProjectAccentColor(project.id);
  const progress =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 group relative flex flex-col min-w-0 h-full">
      <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}22` }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
        </div>
        <ProjectCardActions
          projectTitle={project.title}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <Link href={`/projects/${project.id}`} className="block group/link min-w-0 flex-1">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 break-words group-hover/link:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4 break-words">
          {project.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground min-w-0">
          <span className="truncate">
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </span>
          <span className="shrink-0">{formatDistanceToNow(project.createdAt)}</span>
        </div>
        {taskCount > 0 && (
          <div className="mt-3 min-w-0">
            <div className="flex justify-between text-xs mb-1.5 gap-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-indigo-300 font-medium tabular-nums shrink-0">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500")}
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Open workspace
          <ArrowUpRight className="h-3 w-3 shrink-0" />
        </div>
      </Link>
    </div>
  );
}
