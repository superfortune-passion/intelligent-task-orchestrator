"use client";

import { useCallback, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { requestExecutionPlan } from "@/services/ai-generate-client";
import { dedupeAndFillPlan } from "@/services/ai-plan";
import { toast } from "@/hooks/use-toast";
import type { TaskPriority } from "@/types/task";

export type MagicGenerateState = "idle" | "loading" | "error";

const PLAN_SIZE = 5;

export function useMagicGenerate(projectId: string, projectTitle: string) {
  const { createTasksBulk, getTasksByProject } = useApp();
  const [state, setState] = useState<MagicGenerateState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [newTaskIds, setNewTaskIds] = useState<string[]>([]);

  const runGenerate = useCallback(async () => {
    if (!projectTitle.trim()) {
      setState("error");
      setErrorMessage("Project title is required to generate tasks.");
      toast({
        title: "AI generation failed",
        description: "Project title is required to generate tasks.",
        variant: "destructive",
      });
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      const existingTaskTitles = getTasksByProject(projectId).map((t) => t.title);
      const result = await requestExecutionPlan(
        projectTitle,
        existingTaskTitles
      );

      if (!result.success) {
        setState("error");
        setErrorMessage(result.error);
        toast({
          title: "AI generation failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      const uniqueTasks = dedupeAndFillPlan(
        result.tasks,
        projectTitle,
        existingTaskTitles,
        PLAN_SIZE
      );

      if (uniqueTasks.length === 0) {
        setState("error");
        const msg =
          "All generated tasks already exist on this board. Try again after adding different work.";
        setErrorMessage(msg);
        toast({
          title: "AI generation failed",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      const created = createTasksBulk(
        projectId,
        uniqueTasks.map((t) => ({
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

      const count = created.length;
      toast({
        title:
          count === PLAN_SIZE
            ? "5 AI tasks generated"
            : `${count} AI task${count !== 1 ? "s" : ""} generated`,
        description: `${count} new task${count !== 1 ? "s" : ""} added to To Do.`,
        variant: "success",
      });

      window.setTimeout(() => {
        setNewTaskIds((prev) => prev.filter((id) => !ids.includes(id)));
      }, 2500);
    } catch {
      setState("error");
      const msg =
        "An unexpected error occurred. Your data is safe — please retry.";
      setErrorMessage(msg);
      toast({
        title: "AI generation failed",
        description: msg,
        variant: "destructive",
      });
    }
  }, [projectId, projectTitle, createTasksBulk, getTasksByProject]);

  return {
    state,
    errorMessage,
    isGenerating: state === "loading",
    newTaskIds,
    generate: runGenerate,
    retry: runGenerate,
  };
}
