import { toast } from "@/hooks/use-toast";

/** Keep toast descriptions readable when task titles are very long */
export function truncateForToast(text: string, max = 72): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

const CRUD_DURATION = 6000;

export function toastTaskCreated(title: string, status: string) {
  toast({
    title: "Task created",
    description: `"${truncateForToast(title)}" added to ${status}.`,
    variant: "success",
    duration: CRUD_DURATION,
  });
}

export function toastTaskUpdated(title: string) {
  toast({
    title: "Changes saved",
    description: `"${truncateForToast(title)}" was updated.`,
    variant: "info",
    duration: CRUD_DURATION,
  });
}

export function toastTaskDeleted(title: string) {
  toast({
    title: "Task deleted",
    description: `"${truncateForToast(title)}" was removed from your board.`,
    variant: "success",
    duration: CRUD_DURATION,
  });
}

export function toastProjectCreated(title: string) {
  toast({
    title: "Project created",
    description: `"${truncateForToast(title)}" is ready on your dashboard.`,
    variant: "success",
    duration: CRUD_DURATION,
  });
}

export function toastProjectUpdated(title: string) {
  toast({
    title: "Project saved",
    description: `"${truncateForToast(title)}" was updated.`,
    variant: "info",
    duration: CRUD_DURATION,
  });
}

export function toastProjectDeleted(title: string) {
  toast({
    title: "Project deleted",
    description: `"${truncateForToast(title)}" and all tasks were removed.`,
    variant: "success",
    duration: CRUD_DURATION,
  });
}
