/** Core project entity persisted in localStorage */
export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

/** Payload for create / edit modal forms */
export type ProjectFormData = Pick<Project, "title" | "description">;
