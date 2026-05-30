"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Plus,
  FolderOpen,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { HeroSection } from "@/components/dashboard/hero-section";
import { StatCard } from "@/components/shared/stat-card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const {
    hydrated,
    projects,
    tasks,
    stats,
    createProject,
    updateProject,
    deleteProject,
  } = useApp();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 6),
    [projects]
  );

  const getTaskCounts = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    return {
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === "done").length,
    };
  };

  if (!hydrated) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <HeroSection onCreateProject={() => setCreateOpen(true)} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          trend="Active workspaces"
        />
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks}
          icon={ListTodo}
          trend="Across all projects"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressTasks}
          icon={TrendingUp}
          trend="Currently executing"
        />
        <StatCard
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          trend={`${stats.completedTasks} tasks completed`}
        />
      </div>

      <section id="recent-projects">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Recent Projects
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest execution workspaces
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="glass-card rounded-xl">
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="No projects yet. Create your first project."
              action={
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentProjects.map((project) => {
              const counts = getTaskCounts(project.id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={counts.total}
                  completedCount={counts.completed}
                  onEdit={() => setEditProject(project)}
                  onDelete={() => setDeleteTarget(project)}
                />
              );
            })}
          </div>
        )}

        {projects.length > 6 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/projects">View all projects</Link>
            </Button>
          </div>
        )}
      </section>

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={(data) => {
          const p = createProject(data);
          toast({
            title: "Project created",
            description: `"${p.title}" is ready for execution planning.`,
            variant: "success",
          });
        }}
      />

      <ProjectFormDialog
        open={!!editProject}
        onOpenChange={(o) => !o && setEditProject(null)}
        project={editProject ?? undefined}
        mode="edit"
        onSubmit={(data) => {
          if (editProject) {
            updateProject(editProject.id, data);
            toast({
              title: "Project updated",
              variant: "success",
            });
            setEditProject(null);
          }
        }}
      />

      <DeleteProjectDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        projectTitle={deleteTarget?.title ?? ""}
        onConfirm={() => {
          if (deleteTarget) {
            deleteProject(deleteTarget.id);
            toast({
              title: "Project deleted",
              variant: "success",
            });
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
