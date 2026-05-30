"use client";

import { useCallback, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { requestExecutionPlan } from "@/services/ai-generate-client";
import { toast } from "@/hooks/use-toast";
import type { TaskPriority } from "@/types/task";

export type MagicGenerateState = "idle" | "loading" | "error";

export function useMagicGenerate(projectId: string, projectTitle: string) {
  const { createTasksBulk } = useApp();
  const [state, setState] = useState<MagicGenerateState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [newTaskIds, setNewTaskIds] = useState<string[]>([]);

  const runGenerate = useCallback(async () => {
    if (!projectTitle.trim()) {
      setState("error");
      setErrorMessage("Project title is required to generate tasks.");
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      const result = await requestExecutionPlan(projectTitle);

      if (!result.success) {
        setState("error");
        setErrorMessage(result.error);
        return;
      }

      const created = createTasksBulk(
        projectId,
        result.tasks.map((t) => ({
          title: t.title,
          description: t.description ?? "",
          category: t.category,
          priority: (t.priority ?? "Medium") as TaskPriority,
          dueDate: null,
        }))
      );

      const ids = created.map((t) => t.id);
      setNewTaskIds(ids);
      setState("idle");

      toast({
        title: "Execution plan generated",
        description: `${created.length} tasks added to To Do.`,
        variant: "success",
      });

      window.setTimeout(() => {
        setNewTaskIds((prev) => prev.filter((id) => !ids.includes(id)));
      }, 2500);
    } catch {
      setState("error");
      setErrorMessage(
        "An unexpected error occurred. Your data is safe — please retry."
      );
    }
  }, [projectId, projectTitle, createTasksBulk]);

  return {
    state,
    errorMessage,
    isGenerating: state === "loading",
    newTaskIds,
    generate: runGenerate,
    retry: runGenerate,
  };
}
