"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Pencil,
  ListTodo,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { MagicGenerate } from "@/components/ai/magic-generate";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { useProjectCrud } from "@/hooks/use-project-crud";
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
import { toast } from "@/hooks/use-toast";
import { TASK_CATEGORIES, TASK_PRIORITIES, type Task } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    hydrated,
    getProject,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useApp();
  const crud = useProjectCrud();

  const project = getProject(id);
  const accent = project ? getProjectAccentColor(project.id) : "#6366f1";
  const tasks = getTasksByProject(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | null>(null);

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
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
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
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
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
                  onClick={() => crud.openEdit(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                  {project.description}
                </p>
              )}
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

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditTask(null);
                setTaskDialogOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            <MagicGenerate
              projectId={project.id}
              projectTitle={project.title}
            />
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
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
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
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {TASK_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-card rounded-xl">
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="No tasks yet. Generate an execution plan with AI."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <MagicGenerate
                  projectId={project.id}
                  projectTitle={project.title}
                />
                <Button
                  variant="outline"
                  onClick={() => setTaskDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task Manually
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onMoveTask={moveTask}
          onEditTask={(t) => {
            setEditTask(t);
            setTaskDialogOpen(true);
          }}
          onDeleteTask={(t) => setDeleteTaskTarget(t)}
          searchQuery={searchQuery}
          filterPriority={filterPriority}
          filterCategory={filterCategory}
        />
      )}

      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={(o) => {
          setTaskDialogOpen(o);
          if (!o) setEditTask(null);
        }}
        task={editTask ?? undefined}
        mode={editTask ? "edit" : "create"}
        onSubmit={(data) => {
          if (editTask) {
            updateTask(editTask.id, data);
            toast({ title: "Task updated", variant: "success" });
          } else {
            createTask(project.id, data);
            toast({ title: "Task created", variant: "success" });
          }
          setEditTask(null);
        }}
      />

      <DeleteTaskDialog
        open={!!deleteTaskTarget}
        onOpenChange={(o) => !o && setDeleteTaskTarget(null)}
        taskTitle={deleteTaskTarget?.title ?? ""}
        onConfirm={() => {
          if (deleteTaskTarget) {
            deleteTask(deleteTaskTarget.id);
            toast({ title: "Task deleted", variant: "success" });
            setDeleteTaskTarget(null);
          }
        }}
      />

      <ProjectCrudModals
        createOpen={crud.createOpen}
        onCreateOpenChange={crud.setCreateOpen}
        editProject={crud.editProject}
        onEditOpenChange={(open) => !open && crud.setEditProject(null)}
        deleteTarget={crud.deleteTarget}
        onDeleteOpenChange={(open) => !open && crud.setDeleteTarget(null)}
        onCreate={crud.handleCreate}
        onUpdate={crud.handleUpdate}
        onDeleteConfirm={crud.handleDeleteConfirm}
      />
    </div>
  );
}
