"use client";

import { useState } from "react";
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
  const [isConfirming, setIsConfirming] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) setIsConfirming(false);
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (isConfirming) return;
    setIsConfirming(true);
    onConfirm();
    setIsConfirming(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-red-500/25 bg-card/95 backdrop-blur-xl shadow-2xl shadow-red-950/30 ring-1 ring-red-500/15 sm:max-w-md">
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
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isConfirming}
            className="transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="transition-all duration-200 shadow-lg shadow-red-950/40 hover:shadow-red-900/50"
          >
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
