export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskCategory =
  | "Research"
  | "Planning"
  | "Marketing"
  | "Operations"
  | "Review"
  | "Design"
  | "Development"
  | "General";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type { Project, ProjectFormData } from "@/types/project";

import type { Project } from "@/types/project";

export interface AppState {
  projects: Project[];
  tasks: Task[];
}

export type TaskFormData = Pick<
  Task,
  "title" | "description" | "category" | "priority" | "status" | "dueDate"
>;

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

export const TASK_PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "urgent", label: "Urgent" },
];

export const TASK_CATEGORIES: TaskCategory[] = [
  "Research",
  "Planning",
  "Marketing",
  "Operations",
  "Review",
  "Design",
  "Development",
  "General",
];
