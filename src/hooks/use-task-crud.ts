"use client";

import { useCallback, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import {
  toastTaskCreated,
  toastTaskDeleted,
  toastTaskUpdated,
} from "@/lib/crud-toast";
import type { Task, TaskFormData, TaskStatus } from "@/types/task";

export function useTaskCrud(projectId: string) {
  const { createTask, updateTask, deleteTask } = useApp();

  const [createOpen, setCreateOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("To Do");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const openCreate = useCallback((status: TaskStatus = "To Do") => {
    setEditTask(null);
    setDefaultStatus(status);
    setCreateOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditTask(task);
    setCreateOpen(true);
  }, []);

  const openDelete = useCallback((task: Task) => {
    setDeleteTarget(task);
  }, []);

  const handleCreate = useCallback(
    (data: TaskFormData) => {
      const task = createTask(projectId, data);
      setCreateOpen(false);
      toastTaskCreated(task.title, task.status);
    },
    [createTask, projectId]
  );

  const handleUpdate = useCallback(
    (data: TaskFormData) => {
      if (!editTask) return;
      updateTask(editTask.id, data);
      setEditTask(null);
      setCreateOpen(false);
      toastTaskUpdated(data.title.trim());
    },
    [editTask, updateTask]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    const title = deleteTarget.title;
    deleteTask(deleteTarget.id);
    setDeleteTarget(null);
    toastTaskDeleted(title);
  }, [deleteTarget, deleteTask]);

  return {
    createOpen,
    setCreateOpen,
    defaultStatus,
    editTask,
    setEditTask,
    deleteTarget,
    setDeleteTarget,
    openCreate,
    openEdit,
    openDelete,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
    isEditMode: !!editTask,
  };
}
