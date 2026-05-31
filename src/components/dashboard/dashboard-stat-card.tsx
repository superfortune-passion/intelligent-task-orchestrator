import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "indigo" | "violet" | "teal" | "emerald";
  className?: string;
}

const accentStyles = {
  indigo: "from-indigo-500/20 to-transparent border-indigo-500/20 text-indigo-400",
  violet: "from-violet-500/20 to-transparent border-violet-500/20 text-violet-400",
  teal: "from-teal-500/20 to-transparent border-teal-500/20 text-teal-400",
  emerald:
    "from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400",
};

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "indigo",
  className,
}: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        "glass-card glass-card-hover rounded-xl p-5 sm:p-6 flex flex-col gap-4 min-w-0 overflow-hidden cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider leading-snug break-words min-w-0 flex-1">
          {label}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-gradient-to-br",
            accentStyles[accent]
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight truncate">
          {value}
        </p>
        {hint && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
