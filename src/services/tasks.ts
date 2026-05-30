import { generateId } from "@/lib/id";
import type {
  Task,
  TaskFormData,
  TaskPriority,
  TaskStatus,
} from "@/types/task";
import { TASK_CATEGORY_SUGGESTIONS } from "@/types/task";

const LEGACY_STATUS: Record<string, TaskStatus> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const LEGACY_PRIORITY: Record<string, TaskPriority> = {
  urgent: "High",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function normalizeStatus(raw: unknown): TaskStatus {
  if (typeof raw === "string") {
    if (raw in LEGACY_STATUS) return LEGACY_STATUS[raw];
    if (
      raw === "To Do" ||
      raw === "In Progress" ||
      raw === "Review" ||
      raw === "Done"
    ) {
      return raw;
    }
  }
  return "To Do";
}

function normalizePriority(raw: unknown): TaskPriority {
  if (typeof raw === "string") {
    const lower = raw.toLowerCase();
    if (lower in LEGACY_PRIORITY) return LEGACY_PRIORITY[lower];
    if (raw === "High" || raw === "Medium" || raw === "Low") return raw;
  }
  return "Medium";
}

export function normalizeTask(raw: unknown): Task | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.projectId !== "string") {
    return null;
  }

  const now = new Date().toISOString();
  const createdAt =
    typeof record.createdAt === "string" ? record.createdAt : now;

  return {
    id: record.id,
    projectId: record.projectId,
    title: typeof record.title === "string" ? record.title.trim() : "",
    description:
      typeof record.description === "string" ? record.description.trim() : "",
    category:
      typeof record.category === "string" && record.category.trim()
        ? record.category.trim()
        : "General",
    priority: normalizePriority(record.priority),
    status: normalizeStatus(record.status),
    dueDate:
      typeof record.dueDate === "string" ? record.dueDate : null,
    createdAt,
    updatedAt:
      typeof record.updatedAt === "string" ? record.updatedAt : createdAt,
    order: typeof record.order === "number" ? record.order : 0,
  };
}

export function createTaskEntity(
  projectId: string,
  data: TaskFormData,
  order: number
): Task {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    projectId,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.trim() || "General",
    priority: data.priority,
    status: data.status,
    dueDate: data.dueDate,
    createdAt: now,
    updatedAt: now,
    order,
  };
}

export function updateTaskEntity(task: Task, data: TaskFormData): Task {
  return {
    ...task,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.trim() || "General",
    priority: data.priority,
    status: data.status,
    dueDate: data.dueDate,
    updatedAt: new Date().toISOString(),
  };
}

export function isSuggestedCategory(category: string): boolean {
  return (TASK_CATEGORY_SUGGESTIONS as readonly string[]).includes(category);
}
