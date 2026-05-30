import type { GeneratePlanResult } from "@/types/ai";
import { generateExecutionPlan } from "@/services/ai-plan";

/** Calls API route when available; falls back to local template engine */
export async function requestExecutionPlan(
  projectTitle: string
): Promise<GeneratePlanResult> {
  try {
    const response = await fetch("/api/ai/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectTitle }),
    });

    if (!response.ok) {
      const fallback = await generateExecutionPlan(projectTitle);
      return fallback;
    }

    const data = (await response.json()) as GeneratePlanResult;
    if (data.success && data.tasks.length > 0) {
      return data;
    }

    return generateExecutionPlan(projectTitle);
  } catch {
    return generateExecutionPlan(projectTitle);
  }
}
