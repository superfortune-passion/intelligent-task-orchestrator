import type { GeneratePlanResult } from "@/types/ai";
import { generateExecutionPlan } from "@/services/ai-plan";

export interface RequestExecutionPlanOptions {
  projectTitle: string;
  existingTaskTitles?: string[];
}

/** Calls API route when available; falls back to local template engine */
export async function requestExecutionPlan(
  projectTitle: string,
  existingTaskTitles: string[] = []
): Promise<GeneratePlanResult> {
  try {
    const response = await fetch("/api/ai/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectTitle, existingTaskTitles }),
    });

    if (!response.ok) {
      return generateExecutionPlan(projectTitle, existingTaskTitles);
    }

    const data = (await response.json()) as GeneratePlanResult;
    if (data.success && data.tasks.length > 0) {
      return data;
    }

    if (!data.success) {
      return data;
    }

    return generateExecutionPlan(projectTitle, existingTaskTitles);
  } catch {
    return generateExecutionPlan(projectTitle, existingTaskTitles);
  }
}
