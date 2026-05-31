import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-500/15">
        <Icon className="h-7 w-7 text-indigo-400" aria-hidden />
      </div>
      <h3 className="typo-section-title text-center mb-2">{title}</h3>
      <p className="typo-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
