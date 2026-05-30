"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "@/services/storage";
import {
  createProjectEntity,
  updateProjectEntity,
} from "@/services/projects";
import { createTaskEntity, updateTaskEntity } from "@/services/tasks";
import type { AppState } from "@/types";
import type { ProjectFormData } from "@/types/project";
import type { Task, TaskFormData, TaskStatus } from "@/types/task";

export function useAppStore() {
  const [state, setState] = useState<AppState>({ projects: [], tasks: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const createProject = useCallback((data: ProjectFormData) => {
    const project = createProjectEntity(data);
    setState((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
    return project;
  }, []);

  const updateProject = useCallback((id: string, data: ProjectFormData) => {
    setState((prev) => {
      const existing = prev.projects.find((p) => p.id === id);
      if (!existing) return prev;
      const updated = updateProjectEntity(existing, data);
      const rest = prev.projects.filter((p) => p.id !== id);
      return {
        ...prev,
        projects: [updated, ...rest],
      };
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => ({
      projects: prev.projects.filter((p) => p.id !== id),
      tasks: prev.tasks.filter((t) => t.projectId !== id),
    }));
  }, []);

  const getProject = useCallback(
    (id: string) => state.projects.find((p) => p.id === id),
    [state.projects]
  );

  const createTask = useCallback(
    (projectId: string, data: TaskFormData) => {
      const status = data.status ?? "To Do";
      const maxOrder = state.tasks
        .filter((t) => t.projectId === projectId && t.status === status)
        .reduce((max, t) => Math.max(max, t.order), -1);

      const task = createTaskEntity(projectId, { ...data, status }, maxOrder + 1);
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
      return task;
    },
    [state.tasks]
  );

  const createTasksBulk = useCallback(
    (projectId: string, items: Omit<TaskFormData, "status">[]) => {
      const status: TaskStatus = "To Do";
      const existingMax = state.tasks
        .filter((t) => t.projectId === projectId && t.status === status)
        .reduce((max, t) => Math.max(max, t.order), -1);

      const newTasks: Task[] = items.map((data, index) =>
        createTaskEntity(
          projectId,
          { ...data, status },
          existingMax + 1 + index
        )
      );

      setState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, ...newTasks],
      }));
      return newTasks;
    },
    [state.tasks]
  );

  const updateTask = useCallback((id: string, data: TaskFormData) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? updateTaskEntity(t, data) : t
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const moveTask = useCallback(
    (taskId: string, newStatus: TaskStatus, newOrder: number) => {
      setState((prev) => {
        const task = prev.tasks.find((t) => t.id === taskId);
        if (!task) return prev;

        const updated = prev.tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: newStatus,
              order: newOrder,
              updatedAt: new Date().toISOString(),
            };
          }
          if (
            t.projectId === task.projectId &&
            t.status === newStatus &&
            t.id !== taskId &&
            t.order >= newOrder
          ) {
            return { ...t, order: t.order + 1 };
          }
          return t;
        });

        return { ...prev, tasks: updated };
      });
    },
    []
  );

  const getTasksByProject = useCallback(
    (projectId: string) =>
      state.tasks
        .filter((t) => t.projectId === projectId)
        .sort((a, b) => a.order - b.order),
    [state.tasks]
  );

  const stats = useMemo(() => {
    const totalProjects = state.projects.length;
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(
      (t) => t.status === "Done"
    ).length;
    const inProgressTasks = state.tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
    };
  }, [state.projects, state.tasks]);

  return {
    hydrated,
    projects: state.projects,
    tasks: state.tasks,
    stats,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    createTask,
    createTasksBulk,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByProject,
  };
}
