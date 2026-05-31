import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export function getProjectMetrics(project: Project, tasks: Task[]) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;

  const timestamps = [project.createdAt, ...tasks.map((t) => t.updatedAt)];
  const lastUpdatedAt = timestamps.reduce<string | null>((latest, iso) => {
    if (!iso) return latest;
    if (!latest || new Date(iso) > new Date(latest)) return iso;
    return latest;
  }, null);

  return { totalTasks, completedTasks, lastUpdatedAt };
}
