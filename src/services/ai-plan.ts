import type {
  AiPlanCategory,
  GeneratedSubtask,
  GeneratePlanResult,
} from "@/types/ai";
import { AI_PLAN_CATEGORIES } from "@/types/ai";
import type { TaskPriority } from "@/types/task";

const CATEGORY_TEMPLATES: Record<
  string,
  { category: AiPlanCategory; title: string; description: string; priority: TaskPriority }[]
> = {
  launch: [
    {
      category: "Research",
      title: "Research target audience and market positioning",
      description:
        "Analyze customer segments, competitors, and market gaps.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Define launch timeline and milestones",
      description: "Create phased rollout with dependencies and checkpoints.",
      priority: "High",
    },
    {
      category: "Marketing",
      title: "Create marketing assets and campaign brief",
      description: "Develop messaging, creative assets, and channel strategy.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Schedule launch event and logistics",
      description: "Coordinate vendors, inventory, and support teams.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Measure launch performance and iterate",
      description: "Track KPIs, gather feedback, and document learnings.",
      priority: "Low",
    },
  ],
  default: [
    {
      category: "Research",
      title: "Research scope and stakeholder requirements",
      description: "Gather requirements, constraints, and success criteria.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Define project timeline and deliverables",
      description: "Break work into phases with milestones and owners.",
      priority: "High",
    },
    {
      category: "Marketing",
      title: "Align messaging and communication plan",
      description: "Draft communications for key project milestones.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Set up tools, processes, and workflows",
      description: "Configure project tools and handoff procedures.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Review outcomes and document learnings",
      description: "Conduct retrospective and capture actionable insights.",
      priority: "Low",
    },
  ],
};

function detectProjectType(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes("launch") ||
    lower.includes("product") ||
    lower.includes("go-to-market")
  )
    return "launch";
  if (lower.includes("marketing") || lower.includes("campaign")) return "launch";
  return "default";
}

function personalizeTasks(
  projectTitle: string,
  templates: typeof CATEGORY_TEMPLATES.launch
): GeneratedSubtask[] {
  const name = projectTitle.trim() || "this project";
  return templates.map((task) => ({
    title: `${task.title} — ${name}`,
    category: task.category,
    description: `${task.description} Tailored for ${name}.`,
    priority: task.priority,
  }));
}

export function buildTemplatePlan(projectTitle: string): GeneratedSubtask[] {
  const type = detectProjectType(projectTitle);
  const templates = CATEGORY_TEMPLATES[type] ?? CATEGORY_TEMPLATES.default;
  return personalizeTasks(projectTitle, templates).slice(0, 5);
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
    if (tasks.length >= 5) break;
  }

  return tasks.length === 5 ? tasks : null;
}

export async function generateExecutionPlan(
  projectTitle: string,
  options?: { forceError?: boolean }
): Promise<GeneratePlanResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1200 + Math.random() * 600)
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
    return { success: true, tasks: buildTemplatePlan(projectTitle) };
  } catch {
    return {
      success: false,
      error: "Failed to generate execution plan. Please try again.",
    };
  }
}
