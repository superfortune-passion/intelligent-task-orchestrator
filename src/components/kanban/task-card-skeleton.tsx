import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TaskCardSkeletonProps {
  index?: number;
}

export function TaskCardSkeleton({ index = 0 }: TaskCardSkeletonProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-lg p-3.5 space-y-3 skeleton-card-enter",
        "border border-indigo-500/20 ring-1 ring-indigo-500/10"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-hidden
    >
      <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
      <Skeleton className="h-3 w-full skeleton-shimmer" />
      <Skeleton className="h-3 w-2/3 skeleton-shimmer" />
      <div className="flex gap-2">
        <Skeleton
          className="h-5 w-16 rounded-md skeleton-shimmer"
          style={{ animationDelay: `${index * 80 + 100}ms` }}
        />
        <Skeleton
          className="h-5 w-14 rounded-md skeleton-shimmer"
          style={{ animationDelay: `${index * 80 + 160}ms` }}
        />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-20 skeleton-shimmer" />
        <Skeleton className="h-6 w-6 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
