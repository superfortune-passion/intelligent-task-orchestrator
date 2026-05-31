"use client";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  onConfirm: () => void;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskTitle,
  onConfirm,
}: DeleteTaskDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this task?"
      description={
        <p>
          The task will be removed from your board and from local storage
          immediately after you confirm.
        </p>
      }
      itemLabel="Task to delete"
      itemName={taskTitle}
      confirmLabel="Yes, delete task"
      onConfirm={onConfirm}
    />
  );
}
