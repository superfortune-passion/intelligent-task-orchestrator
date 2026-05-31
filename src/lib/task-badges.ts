import type { TaskPriority } from "@/types/task";

export function getPriorityBadgeVariant(
  priority: TaskPriority
): "high" | "medium" | "low" {
  switch (priority) {
    case "High":
      return "high";
    case "Low":
      return "low";
    default:
      return "medium";
  }
}

/** Dot color for task card footer priority indicator */
export function getPriorityDotClass(priority: TaskPriority): string {
  switch (priority) {
    case "High":
      return "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]";
    case "Low":
      return "bg-slate-400";
    default:
      return "bg-amber-400";
  }
}

export function getCategoryBadgeVariant(
  category: string
): "research" | "planning" | "marketing" | "operations" | "review" | "design" | "development" | "general" {
  const key = category.toLowerCase();
  const map: Record<string, ReturnType<typeof getCategoryBadgeVariant>> = {
    research: "research",
    planning: "planning",
    marketing: "marketing",
    operations: "operations",
    review: "review",
    design: "design",
    development: "development",
  };
  return map[key] ?? "general";
}
