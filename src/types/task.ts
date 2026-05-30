/** Task priority levels */
export type TaskPriority = "High" | "Medium" | "Low";

/** Kanban column status */
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** ISO date string for localStorage */
  dueDate: string | null;
  /** ISO date string */
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type TaskFormData = Pick<
  Task,
  "title" | "description" | "category" | "priority" | "status" | "dueDate"
>;

export const TASK_STATUSES: { id: TaskStatus; label: TaskStatus }[] = [
  { id: "To Do", label: "To Do" },
  { id: "In Progress", label: "In Progress" },
  { id: "Review", label: "Review" },
  { id: "Done", label: "Done" },
];

export const TASK_PRIORITIES: { id: TaskPriority; label: TaskPriority }[] = [
  { id: "High", label: "High" },
  { id: "Medium", label: "Medium" },
  { id: "Low", label: "Low" },
];

export const TASK_CATEGORY_SUGGESTIONS = [
  "Research",
  "Planning",
  "Marketing",
  "Operations",
  "Review",
  "Design",
  "Development",
  "General",
] as const;

/** Stable droppable column ids (status labels contain spaces) */
export const STATUS_COLUMN_SLUG: Record<TaskStatus, string> = {
  "To Do": "todo",
  "In Progress": "in_progress",
  "Review": "review",
  "Done": "done",
};

export function statusFromColumnId(columnId: string): TaskStatus | null {
  const slug = columnId.replace(/^column-/, "");
  const entry = Object.entries(STATUS_COLUMN_SLUG).find(([, s]) => s === slug);
  return entry ? (entry[0] as TaskStatus) : null;
}

export function columnIdFromStatus(status: TaskStatus): string {
  return `column-${STATUS_COLUMN_SLUG[status]}`;
}
