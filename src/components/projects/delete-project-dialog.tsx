"use client";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  onConfirm: () => void;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectTitle,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this project?"
      description={
        <p>
          The project and every task inside it will be permanently removed from
          your workspace and local storage.
        </p>
      }
      itemLabel="Project to delete"
      itemName={projectTitle}
      confirmLabel="Yes, delete project"
      onConfirm={onConfirm}
    />
  );
}
