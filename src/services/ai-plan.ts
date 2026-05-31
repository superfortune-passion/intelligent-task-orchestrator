import type { GeneratedSubtask, GeneratePlanResult } from "@/types/ai";
import { AI_PLAN_CATEGORIES } from "@/types/ai";
import type { TaskPriority } from "@/types/task";
import {
  PROJECT_PLAN_POOLS,
  buildContextualFillers,
  detectProjectArchetype,
  type PlanTemplate,
} from "@/services/ai-templates";

const PLAN_SIZE = 5;

/** Normalize titles for duplicate detection */
export function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isDuplicateTitle(
  title: string,
  existingKeys: Set<string>
): boolean {
  return existingKeys.has(normalizeTitleKey(title));
}

function templateToSubtask(template: PlanTemplate): GeneratedSubtask {
  return {
    title: template.title,
    category: template.category,
    description: template.description,
    priority: template.priority,
  };
}

/** Collect candidates from archetype pool + contextual fillers */
function getCandidatePool(projectTitle: string): PlanTemplate[] {
  const archetype = detectProjectArchetype(projectTitle);
  const primary = PROJECT_PLAN_POOLS[archetype] ?? PROJECT_PLAN_POOLS.default;
  const fallback = PROJECT_PLAN_POOLS.default;
  const merged = [...primary];

  for (const item of fallback) {
    if (!merged.some((t) => normalizeTitleKey(t.title) === normalizeTitleKey(item.title))) {
      merged.push(item);
    }
  }

  for (let i = 0; i < 6; i++) {
    merged.push(buildContextualFillers(projectTitle, i));
  }

  return merged;
}

/**
 * Pick up to `count` unique tasks not present in existingTitles.
 * Skips duplicates; uses alternates from the pool then contextual fillers.
 */
export function dedupeAndFillPlan(
  candidates: GeneratedSubtask[],
  projectTitle: string,
  existingTitles: string[],
  count = PLAN_SIZE
): GeneratedSubtask[] {
  const blocked = new Set(existingTitles.map(normalizeTitleKey));
  const used = new Set<string>();
  const result: GeneratedSubtask[] = [];

  const tryAdd = (task: GeneratedSubtask) => {
    const key = normalizeTitleKey(task.title);
    if (!key || blocked.has(key) || used.has(key)) return false;
    used.add(key);
    result.push(task);
    return true;
  };

  for (const task of candidates) {
    tryAdd(task);
    if (result.length >= count) return result;
  }

  for (const template of getCandidatePool(projectTitle)) {
    tryAdd(templateToSubtask(template));
    if (result.length >= count) return result;
  }

  let fillerIndex = 0;
  while (result.length < count && fillerIndex < 12) {
    const filler = buildContextualFillers(
      projectTitle,
      fillerIndex + result.length
    );
    const titled: GeneratedSubtask = {
      ...templateToSubtask(filler),
      title: `${filler.title} (phase ${fillerIndex + 1})`,
    };
    tryAdd(titled);
    fillerIndex += 1;
  }

  return result;
}

export function buildTemplatePlan(
  projectTitle: string,
  existingTitles: string[] = []
): GeneratedSubtask[] {
  const pool = getCandidatePool(projectTitle).map(templateToSubtask);
  return dedupeAndFillPlan(pool, projectTitle, existingTitles, PLAN_SIZE);
}

function normalizePriority(raw: unknown): TaskPriority {
  if (typeof raw === "string") {
    const p = raw.toLowerCase();
    if (p === "high" || p === "urgent") return "High";
    if (p === "low") return "Low";
    if (p === "medium") return "Medium";
    if (raw === "High" || raw === "Medium" || raw === "Low") return raw;
  }
  return "Medium";
}

function normalizeCategory(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "General";
  const trimmed = raw.trim();
  const match = AI_PLAN_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? trimmed;
}

/** Parse Claude / API JSON array of subtasks */
export function parseGeneratedTasksJson(raw: unknown): GeneratedSubtask[] | null {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) return null;
      try {
        data = JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }

  if (!Array.isArray(data)) return null;

  const tasks: GeneratedSubtask[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (typeof row.title !== "string" || !row.title.trim()) continue;
    tasks.push({
      title: row.title.trim(),
      category: normalizeCategory(row.category),
      description:
        typeof row.description === "string" ? row.description.trim() : "",
      priority: normalizePriority(row.priority),
    });
  }

  return tasks.length > 0 ? tasks : null;
}

export function finalizeGeneratedPlan(
  rawTasks: GeneratedSubtask[],
  projectTitle: string,
  existingTitles: string[]
): GeneratedSubtask[] {
  const unique = dedupeAndFillPlan(rawTasks, projectTitle, existingTitles, PLAN_SIZE);
  return unique;
}

export async function generateExecutionPlan(
  projectTitle: string,
  existingTitles: string[] = [],
  options?: { forceError?: boolean }
): Promise<GeneratePlanResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, 900 + Math.random() * 500)
  );

  if (options?.forceError) {
    return {
      success: false,
      error: "Generation service temporarily unavailable. Please retry.",
    };
  }

  if (!projectTitle.trim()) {
    return {
      success: false,
      error: "Project title is required to generate an execution plan.",
    };
  }

  try {
    const tasks = buildTemplatePlan(projectTitle, existingTitles);
    if (tasks.length === 0) {
      return {
        success: false,
        error:
          "All suggested tasks already exist. Add manual tasks or rename existing ones.",
      };
    }
    return { success: true, tasks };
  } catch {
    return {
      success: false,
      error: "Failed to generate execution plan. Please try again.",
    };
  }
}
