import { Inbox } from "lucide-react";

interface ColumnEmptyStateProps {
  columnTitle: string;
}

export function ColumnEmptyState({ columnTitle }: ColumnEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-3 rounded-lg border border-dashed border-border/50 bg-muted/20">
      <Inbox className="h-5 w-5 text-muted-foreground/60 mb-2" aria-hidden />
      <p className="text-xs text-muted-foreground leading-relaxed">
        No tasks in {columnTitle}
      </p>
      <p className="text-[11px] text-muted-foreground/70 mt-1">
        Drag here or add a task
      </p>
    </div>
  );
}
