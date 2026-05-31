"use client";

import { useState, type ReactNode } from "react";
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
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  itemLabel: string;
  itemName: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/** Premium destructive confirmation — visible, centered, auto-focused */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemLabel,
  itemName,
  confirmLabel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
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
      <DialogContent
        className={cn(
          "confirm-dialog-content sm:max-w-md",
          "border-red-500/30 bg-[#0c1222]/98 backdrop-blur-xl",
          "shadow-2xl shadow-red-950/40 ring-2 ring-red-500/20"
        )}
        overlayClassName="confirm-dialog-overlay"
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/35 shadow-lg shadow-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden />
            </div>
            <div className="min-w-0 space-y-2 flex-1">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <div>{description}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                      {itemLabel}
                    </p>
                    <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-foreground font-medium break-words line-clamp-3">
                      {itemName || "Untitled"}
                    </p>
                  </div>
                  <p className="text-xs text-red-300/80 font-medium">
                    This action cannot be undone.
                  </p>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isConfirming}
            className="flex-1 sm:flex-none transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirming}
            autoFocus
            className="flex-1 sm:flex-none transition-all duration-200 shadow-lg shadow-red-950/50 hover:shadow-red-900/60"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
