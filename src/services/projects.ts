import { generateId } from "@/lib/id";
import type { Project, ProjectFormData } from "@/types/project";

/** Normalize legacy localStorage records into the current Project shape */
export function normalizeProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.title !== "string") {
    return null;
  }
  const createdAt =
    typeof record.createdAt === "string"
      ? record.createdAt
      : typeof record.updatedAt === "string"
        ? record.updatedAt
        : new Date().toISOString();

  return {
    id: record.id,
    title: record.title.trim(),
    description:
      typeof record.description === "string" ? record.description.trim() : "",
    createdAt,
  };
}

export function createProjectEntity(data: ProjectFormData): Project {
  return {
    id: generateId(),
    title: data.title.trim(),
    description: data.description.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function updateProjectEntity(
  project: Project,
  data: ProjectFormData
): Project {
  return {
    ...project,
    title: data.title.trim(),
    description: data.description.trim(),
  };
}

/** Most recently created or edited projects first */
export function sortProjectsByRecent(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
