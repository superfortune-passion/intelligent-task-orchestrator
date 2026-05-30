"use client";

import { useState, useMemo } from "react";
import { FolderOpen, Search } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { useProjectCrud } from "@/hooks/use-project-crud";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCrudModals } from "@/components/projects/project-crud-modals";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const { projects, tasks } = useApp();
  const crud = useProjectCrud();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const getTaskCounts = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    return {
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === "done").length,
    };
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all execution workspaces
          </p>
        </div>
        <CreateProjectButton onClick={crud.openCreate} className="shrink-0" />
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl">
          <EmptyState
            icon={FolderOpen}
            title={projects.length === 0 ? "No projects yet" : "No results"}
            description={
              projects.length === 0
                ? "Create your first project to start organizing work."
                : "No projects match your search."
            }
            action={
              projects.length === 0 ? (
                <CreateProjectButton onClick={crud.openCreate} />
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const counts = getTaskCounts(project.id);
            return (
              <ProjectCard
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
