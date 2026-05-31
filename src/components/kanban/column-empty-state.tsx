import { Inbox } from "lucide-react";

interface ColumnEmptyStateProps {
  columnTitle: string;
}

export function ColumnEmptyState({ columnTitle }: ColumnEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-3 rounded-lg border border-dashed border-border/50 bg-muted/20 transition-colors duration-200 hover:border-indigo-500/25 hover:bg-muted/30 min-h-[7.5rem]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-2">
        <Inbox className="h-4 w-4 text-indigo-400/80" aria-hidden />
      </div>
      <p className="text-xs font-medium text-muted-foreground leading-relaxed">
        No tasks in {columnTitle}
      </p>
      <p className="typo-caption mt-1 max-w-[10rem]">
        Drag a card here or use Add Task below
      </p>
    </div>
  );
}
