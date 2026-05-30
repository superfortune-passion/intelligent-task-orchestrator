import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoading() {
  return (
    <div className="dashboard-page space-y-10 md:space-y-12" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-[280px] sm:h-[240px] w-full rounded-2xl" />
      <div>
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[132px] rounded-xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-56 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
