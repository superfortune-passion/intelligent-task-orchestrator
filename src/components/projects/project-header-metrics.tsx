"use client";

import { CheckCircle2, Clock, ListTodo } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date";
import { cn } from "@/lib/utils";

interface ProjectHeaderMetricsProps {
  totalTasks: number;
  completedTasks: number;
  lastUpdatedAt: string | null;
  className?: string;
}

export function ProjectHeaderMetrics({
  totalTasks,
  completedTasks,
  lastUpdatedAt,
  className,
}: ProjectHeaderMetricsProps) {
  const lastUpdatedLabel = lastUpdatedAt
    ? formatDistanceToNow(lastUpdatedAt)
    : "—";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 sm:gap-3 mt-3",
        className
      )}
      aria-label="Project metrics"
    >
      <MetricPill
        icon={ListTodo}
        label="Total Tasks"
        value={String(totalTasks)}
        accent="indigo"
      />
      <MetricPill
        icon={CheckCircle2}
        label="Completed"
        value={String(completedTasks)}
        accent="emerald"
      />
      <MetricPill
        icon={Clock}
        label="Last Updated"
        value={lastUpdatedLabel}
        accent="violet"
        wide
      />
    </div>
  );
}

function MetricPill({
  icon: Icon,
  label,
  value,
  accent,
  wide,
}: {
  icon: typeof ListTodo;
  label: string;
  value: string;
  accent: "indigo" | "emerald" | "violet";
  wide?: boolean;
}) {
  const accentMap = {
    indigo: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
    emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    violet: "border-violet-500/25 bg-violet-500/10 text-violet-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-2",
        "glass-card min-w-0",
        accentMap[accent],
        wide && "min-w-[8.5rem]"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
      <div className="min-w-0 leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground tabular-nums truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
