"use client";

import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import type { Project, ProjectFormData } from "@/types/project";

interface ProjectCrudModalsProps {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  editProject: Project | null;
  onEditOpenChange: (open: boolean) => void;
  deleteTarget: Project | null;
  onDeleteOpenChange: (open: boolean) => void;
  onCreate: (data: ProjectFormData) => void;
  onUpdate: (data: ProjectFormData) => void;
  onDeleteConfirm: () => void;
}

export function ProjectCrudModals({
  createOpen,
  onCreateOpenChange,
  editProject,
  onEditOpenChange,
  deleteTarget,
  onDeleteOpenChange,
  onCreate,
  onUpdate,
  onDeleteConfirm,
}: ProjectCrudModalsProps) {
  return (
    <>
      <ProjectFormDialog
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        mode="create"
        onSubmit={onCreate}
      />
      <ProjectFormDialog
        open={!!editProject}
        onOpenChange={(open) => !open && onEditOpenChange(false)}
        project={editProject ?? undefined}
        mode="edit"
        onSubmit={onUpdate}
      />
      <DeleteProjectDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && onDeleteOpenChange(false)}
        projectTitle={deleteTarget?.title ?? ""}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}
