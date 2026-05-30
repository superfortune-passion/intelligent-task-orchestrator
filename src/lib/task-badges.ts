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
