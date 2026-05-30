import { STORAGE_KEY } from "@/lib/constants";
import { normalizeProject } from "@/services/projects";
import type { AppState } from "@/types";

const DEFAULT_STATE: AppState = {
  projects: [],
  tasks: [],
};

function normalizeState(parsed: AppState): AppState {
  return {
    projects: parsed.projects
      .map((p) => normalizeProject(p))
      .filter((p): p is NonNullable<typeof p> => p !== null),
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.projects || !parsed.tasks) return DEFAULT_STATE;
    return normalizeState(parsed);
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private mode — fail silently
  }
}
