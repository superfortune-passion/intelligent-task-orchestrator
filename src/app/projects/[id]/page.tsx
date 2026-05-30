"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Pencil,
  ListTodo,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { useProjectCrud } from "@/hooks/use-project-crud";
import { useTaskCrud } from "@/hooks/use-task-crud";
import { useMagicGenerate } from "@/hooks/use-magic-generate";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskCrudModals } from "@/components/tasks/task-crud-modals";
import { ProjectCrudModals } from "@/components/projects/project-crud-modals";
import { getProjectAccentColor } from "@/lib/project-color";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamAvatars } from "@/components/shared/team-avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TASK_CATEGORY_SUGGESTIONS,
  TASK_PRIORITIES,
} from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { hydrated, getProject, getTasksByProject, moveTask } = useApp();
  const projectCrud = useProjectCrud();
  const taskCrud = useTaskCrud(id);

  const project = getProject(id);
  const accent = project ? getProjectAccentColor(project.id) : "#6366f1";
  const tasks = getTasksByProject(id);
  const magic = useMagicGenerate(id, project?.title ?? "");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredCount = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || t.priority === filterPriority;
      const matchesCategory =
        filterCategory === "all" || t.category === filterCategory;
      return matchesSearch && matchesPriority && matchesCategory;
    }).length;
  }, [tasks, searchQuery, filterPriority, filterCategory]);

  if (!hydrated) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[320px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto">
        <EmptyState
          icon={ListTodo}
          title="Project not found"
          description="This project may have been deleted or the link is invalid."
          action={
            <Button asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="h-12 w-12 rounded-xl shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `${accent}22` }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: accent }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground break-words">
                  {project.title}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => projectCrud.openEdit(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {project.description ? (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                  {project.description}
                </p>
              ) : null}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <TeamAvatars />
                <span className="text-xs text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                  {filteredCount !== tasks.length &&
                    ` · ${filteredCount} shown`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            disabled={magic.isGenerating}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterPriority}
            onValueChange={setFilterPriority}
            disabled={magic.isGenerating}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterCategory}
            onValueChange={setFilterCategory}
            disabled={magic.isGenerating}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {TASK_CATEGORY_SUGGESTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <KanbanBoard
        tasks={tasks}
        onMoveTask={moveTask}
        onAddTask={taskCrud.openCreate}
        onEditTask={taskCrud.openEdit}
        onDeleteTask={taskCrud.openDelete}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterCategory={filterCategory}
        isGenerating={magic.isGenerating}
        newTaskIds={magic.newTaskIds}
        magicState={magic.state}
        magicError={magic.errorMessage}
        onMagicGenerate={magic.generate}
      />

      <TaskCrudModals
        createOpen={taskCrud.createOpen}
        onCreateOpenChange={taskCrud.setCreateOpen}
        defaultStatus={taskCrud.defaultStatus}
        editTask={taskCrud.editTask}
        onEditClear={() => taskCrud.setEditTask(null)}
        deleteTarget={taskCrud.deleteTarget}
        onDeleteOpenChange={(open) => !open && taskCrud.setDeleteTarget(null)}
        onCreate={taskCrud.handleCreate}
        onUpdate={taskCrud.handleUpdate}
        onDeleteConfirm={taskCrud.handleDeleteConfirm}
      />

      <ProjectCrudModals
        createOpen={projectCrud.createOpen}
        onCreateOpenChange={projectCrud.setCreateOpen}
        editProject={projectCrud.editProject}
        onEditOpenChange={(open) => !open && projectCrud.setEditProject(null)}
        deleteTarget={projectCrud.deleteTarget}
        onDeleteOpenChange={(open) =>
          !open && projectCrud.setDeleteTarget(null)
        }
        onCreate={projectCrud.handleCreate}
        onUpdate={projectCrud.handleUpdate}
        onDeleteConfirm={projectCrud.handleDeleteConfirm}
      />
    </div>
  );
}
