"use client";

import { useState, useMemo } from "react";
import { Plus, FolderOpen, Search } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { projects, tasks, createProject, updateProject, deleteProject } =
    useApp();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all execution workspaces
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
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
                ? "No projects yet. Create your first project."
                : "No projects match your search."
            }
            action={
              projects.length === 0 ? (
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
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
                onEdit={() => setEditProject(project)}
                onDelete={() => setDeleteTarget(project)}
              />
            );
          })}
        </div>
      )}

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={(data) => {
          createProject(data);
          toast({ title: "Project created", variant: "success" });
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
            toast({ title: "Project updated", variant: "success" });
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
            toast({ title: "Project deleted", variant: "success" });
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
