/** Visual accent derived from project id (not stored on Project) */
const ACCENTS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#14b8a6",
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
] as const;

export function getProjectAccentColor(projectId: string): string {
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}
