"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-red-500/20 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/25">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1.5">
              <DialogTitle>Delete task?</DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p>
                    This will permanently remove the task from your board and
                    local storage.
                  </p>
                  <p className="mt-2 rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-foreground font-medium break-words">
                    {taskTitle || "Untitled task"}
                  </p>
                  <p className="mt-2 text-xs">This action cannot be undone.</p>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
