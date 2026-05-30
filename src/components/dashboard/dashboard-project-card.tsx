"use client";

import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date";
import { getProjectAccentColor } from "@/lib/project-color";
import { ProjectCardActions } from "@/components/projects/project-card-actions";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface DashboardProjectCardProps {
  project: Project;
  taskCount: number;
  completedCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function DashboardProjectCard({
  project,
  taskCount,
  completedCount,
  onEdit,
  onDelete,
}: DashboardProjectCardProps) {
  const accent = getProjectAccentColor(project.id);
  const progress =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <article className="glass-card glass-card-hover rounded-xl p-5 sm:p-6 group relative flex flex-col min-w-0 h-full">
      <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}22` }}
        >
          <div
            className="h-3.5 w-3.5 rounded-full"
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

      <Link
        href={`/projects/${project.id}`}
        className="flex flex-col flex-1 min-w-0 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg -m-1 p-1"
      >
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 break-words group-hover/link:text-indigo-300 transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1 min-h-[2.75rem] break-words">
          {project.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground min-w-0 mt-auto">
          <span className="truncate min-w-0 flex-1">
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </span>
          <span className="shrink-0 tabular-nums">
            {formatDistanceToNow(project.createdAt)}
          </span>
        </div>

        {taskCount > 0 && (
          <div className="mt-4 min-w-0">
            <div className="flex justify-between gap-2 text-xs mb-2 min-w-0">
              <span className="text-muted-foreground truncate">Progress</span>
              <span className="text-indigo-300 font-medium tabular-nums shrink-0">
                {progress}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress}% complete`}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "mt-4 flex items-center gap-1.5 text-xs font-medium text-indigo-400",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          )}
        >
          <span className="truncate">Open workspace</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </div>
      </Link>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border/40 sm:hidden">
        <button
          type="button"
          className="flex-1 text-xs font-medium text-muted-foreground hover:text-foreground py-2 rounded-lg hover:bg-muted transition-colors"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="flex-1 text-xs font-medium text-red-400/90 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
