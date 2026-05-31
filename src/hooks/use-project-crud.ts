"use client";

import { useCallback, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import {
  toastProjectCreated,
  toastProjectDeleted,
  toastProjectUpdated,
} from "@/lib/crud-toast";
import type { Project, ProjectFormData } from "@/types/project";

export function useProjectCrud() {
  const { createProject, updateProject, deleteProject } = useApp();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const openEdit = useCallback((project: Project) => setEditProject(project), []);
  const openDelete = useCallback((project: Project) => setDeleteTarget(project), []);

  const handleCreate = useCallback(
    (data: ProjectFormData) => {
      const project = createProject(data);
      setCreateOpen(false);
      toastProjectCreated(project.title);
    },
    [createProject]
  );

  const handleUpdate = useCallback(
    (data: ProjectFormData) => {
      if (!editProject) return;
      updateProject(editProject.id, data);
      setEditProject(null);
      toastProjectUpdated(data.title.trim());
    },
    [editProject, updateProject]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    const title = deleteTarget.title;
    deleteProject(deleteTarget.id);
    setDeleteTarget(null);
    toastProjectDeleted(title);
  }, [deleteTarget, deleteProject]);

  return {
    createOpen,
    setCreateOpen,
    editProject,
    setEditProject,
    deleteTarget,
    setDeleteTarget,
    openCreate,
    openEdit,
    openDelete,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
  };
}
