"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { generateId } from "@/lib/id";
import { loadState, saveState } from "@/services/storage";
import type {
  AppState,
  Project,
  ProjectFormData,
  Task,
  TaskFormData,
  TaskStatus,
} from "@/types";

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
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      color: data.color,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
    return project;
  }, []);

  const updateProject = useCallback(
    (id: string, data: Partial<ProjectFormData>) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                ...data,
                title: data.title?.trim() ?? p.title,
                description: data.description?.trim() ?? p.description,
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }));
    },
    []
  );

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
      const now = new Date().toISOString();
      const status = data.status ?? "todo";
      const maxOrder = state.tasks
        .filter((t) => t.projectId === projectId && t.status === status)
        .reduce((max, t) => Math.max(max, t.order), -1);

      const task: Task = {
        id: generateId(),
        projectId,
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        priority: data.priority,
        status,
        dueDate: data.dueDate,
        createdAt: now,
        updatedAt: now,
        order: maxOrder + 1,
      };
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
      return task;
    },
    [state.tasks]
  );

  const createTasksBulk = useCallback(
    (
      projectId: string,
      items: Omit<TaskFormData, "status">[]
    ) => {
      const now = new Date().toISOString();
      const existingMax = state.tasks
        .filter((t) => t.projectId === projectId && t.status === "todo")
        .reduce((max, t) => Math.max(max, t.order), -1);

      const newTasks: Task[] = items.map((data, index) => ({
        id: generateId(),
        projectId,
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        priority: data.priority,
        status: "todo" as TaskStatus,
        dueDate: data.dueDate ?? null,
        createdAt: now,
        updatedAt: now,
        order: existingMax + 1 + index,
      }));

      setState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, ...newTasks],
      }));
      return newTasks;
    },
    [state.tasks]
  );

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              title: data.title?.trim() ?? t.title,
              description: data.description?.trim() ?? t.description,
              updatedAt: new Date().toISOString(),
            }
          : t
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
            t.id !== taskId
          ) {
            if (t.order >= newOrder) {
              return { ...t, order: t.order + 1 };
            }
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
    const completedTasks = state.tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = state.tasks.filter(
      (t) => t.status === "in_progress"
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
