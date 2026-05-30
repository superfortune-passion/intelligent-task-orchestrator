import type { TaskPriority } from "@/types/task";

export const AI_PLAN_CATEGORIES = [
  "Research",
  "Planning",
  "Marketing",
  "Operations",
  "Review",
] as const;

export type AiPlanCategory = (typeof AI_PLAN_CATEGORIES)[number];

export interface GeneratedSubtask {
  title: string;
  category: string;
  description?: string;
  priority?: TaskPriority;
}

export type GeneratePlanResult =
  | { success: true; tasks: GeneratedSubtask[] }
  | { success: false; error: string };
