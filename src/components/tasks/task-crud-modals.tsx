"use client";

import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import type { Task, TaskFormData, TaskStatus } from "@/types/task";

interface TaskCrudModalsProps {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  defaultStatus: TaskStatus;
  editTask: Task | null;
  onEditClear: () => void;
  deleteTarget: Task | null;
  onDeleteOpenChange: (open: boolean) => void;
  onCreate: (data: TaskFormData) => void;
  onUpdate: (data: TaskFormData) => void;
  onDeleteConfirm: () => void;
}

export function TaskCrudModals({
  createOpen,
  onCreateOpenChange,
  defaultStatus,
  editTask,
  onEditClear,
  deleteTarget,
  onDeleteOpenChange,
  onCreate,
  onUpdate,
  onDeleteConfirm,
}: TaskCrudModalsProps) {
  return (
    <>
      <TaskFormDialog
        open={createOpen}
        onOpenChange={(open) => {
          onCreateOpenChange(open);
          if (!open) onEditClear();
        }}
        task={editTask ?? undefined}
        defaultStatus={defaultStatus}
        mode={editTask ? "edit" : "create"}
        onSubmit={editTask ? onUpdate : onCreate}
      />
      <DeleteTaskDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) onDeleteOpenChange(false);
        }}
        taskTitle={deleteTarget?.title ?? ""}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}
