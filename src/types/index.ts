export type {
  Task,
  TaskFormData,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

export {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_CATEGORY_SUGGESTIONS,
  STATUS_COLUMN_SLUG,
  statusFromColumnId,
  columnIdFromStatus,
} from "@/types/task";

export type { Project, ProjectFormData } from "@/types/project";

import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export interface AppState {
  projects: Project[];
  tasks: Task[];
}

/** @deprecated Use TASK_CATEGORY_SUGGESTIONS */
export const TASK_CATEGORIES = [
  "Research",
  "Planning",
  "Marketing",
  "Operations",
  "Review",
  "Design",
  "Development",
  "General",
] as const;
