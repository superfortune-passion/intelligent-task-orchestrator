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

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
}

export type ProjectFormData = Pick<Project, "title" | "description" | "color">;

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

export const PROJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
];
