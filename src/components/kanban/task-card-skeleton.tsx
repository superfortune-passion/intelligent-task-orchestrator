import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TaskCardSkeletonProps {
  index?: number;
}

/** Matches TaskCard min-height and footer layout to reduce CLS */
export function TaskCardSkeleton({ index = 0 }: TaskCardSkeletonProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-lg p-3.5 min-h-[7.5rem] flex flex-col gap-3 skeleton-card-enter",
        "border border-indigo-500/20 ring-1 ring-indigo-500/10"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-hidden
    >
      <div className="flex gap-2">
        <Skeleton className="h-4 w-4 shrink-0 rounded skeleton-shimmer" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-4 w-[85%] skeleton-shimmer" />
          <Skeleton className="h-3 w-full skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-md skeleton-shimmer" />
        <Skeleton className="h-5 w-14 rounded-md skeleton-shimmer" />
      </div>
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/30">
        <Skeleton className="h-3 w-24 skeleton-shimmer" />
        <Skeleton className="h-3 w-12 skeleton-shimmer" />
      </div>
    </div>
  );
}
