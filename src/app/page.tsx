"use client";

import { useMemo, useCallback } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { useProjectCrud } from "@/hooks/use-project-crud";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { SectionHeader } from "@/components/dashboard/section-header";
import { ProjectCrudModals } from "@/components/projects/project-crud-modals";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { hydrated, projects, tasks, stats } = useApp();
  const crud = useProjectCrud();

  const recentProjects = useMemo(() => projects.slice(0, 6), [projects]);

  const getTaskCounts = useCallback(
    (projectId: string) => {
      const projectTasks = tasks.filter((t) => t.projectId === projectId);
      return {
        total: projectTasks.length,
        completed: projectTasks.filter((t) => t.status === "Done").length,
      };
    },
    [tasks]
  );

  if (!hydrated) {
    return (
      <div className="dashboard-page page-shell px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <DashboardLoading />
      </div>
    );
  }

  return (
    <div
      className="dashboard-page page-shell px-4 py-6 sm:px-6 sm:py-8 md:px-8"
      data-dashboard-ready
    >
      <header className="mb-6 sm:mb-8 min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Dashboard
        </p>
        <p className="typo-muted truncate">
          Welcome back — manage your execution workspaces
        </p>
      </header>

      <DashboardHero onCreateProject={crud.openCreate} />

      <section className="mb-10 md:mb-14" aria-labelledby="overview-heading">
        <SectionHeader
          title="Overview"
          description="Track activity across all projects"
          className="mb-6"
        />
        <h2 id="overview-heading" className="sr-only">
          Overview statistics
        </h2>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <DashboardStatCard
            label="Total Projects"
            value={stats.totalProjects}
            icon={FolderKanban}
            hint="Active workspaces"
            accent="indigo"
          />
          <DashboardStatCard
            label="Total Tasks"
            value={stats.totalTasks}
            icon={ListTodo}
            hint="Across all projects"
            accent="violet"
          />
          <DashboardStatCard
            label="In Progress"
            value={stats.inProgressTasks}
            icon={TrendingUp}
            hint="Currently executing"
            accent="teal"
          />
          <DashboardStatCard
            label="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={CheckCircle2}
            hint={`${stats.completedTasks} tasks completed`}
            accent="emerald"
          />
        </div>
      </section>

      <section id="recent-projects" aria-labelledby="recent-projects-heading">
        <SectionHeader
          title="Recent Projects"
          description="Your latest execution workspaces"
          action={<CreateProjectButton onClick={crud.openCreate} />}
        />
        <h2 id="recent-projects-heading" className="sr-only">
          Recent projects
        </h2>

        {recentProjects.length === 0 ? (
          <div className="glass-card rounded-xl border border-border/60">
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="Create your first project to start organizing work."
              action={<CreateProjectButton onClick={crud.openCreate} />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {recentProjects.map((project) => {
              const counts = getTaskCounts(project.id);
              return (
                <DashboardProjectCard
                  key={project.id}
                  project={project}
                  taskCount={counts.total}
                  completedCount={counts.completed}
                  onEdit={() => crud.openEdit(project)}
                  onDelete={() => crud.openDelete(project)}
                />
              );
            })}
          </div>
        )}

        {projects.length > 6 && (
          <div className="mt-8 text-center">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/projects">View all projects</Link>
            </Button>
          </div>
        )}
      </section>

      <ProjectCrudModals
        createOpen={crud.createOpen}
        onCreateOpenChange={crud.setCreateOpen}
        editProject={crud.editProject}
        onEditOpenChange={(open) => !open && crud.setEditProject(null)}
        deleteTarget={crud.deleteTarget}
        onDeleteOpenChange={(open) => !open && crud.setDeleteTarget(null)}
        onCreate={crud.handleCreate}
        onUpdate={crud.handleUpdate}
        onDeleteConfirm={crud.handleDeleteConfirm}
      />
    </div>
  );
}
