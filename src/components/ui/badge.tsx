import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border",
        research: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
        planning: "border-violet-500/20 bg-violet-500/10 text-violet-300",
        marketing: "border-pink-500/20 bg-pink-500/10 text-pink-300",
        operations: "border-teal-500/20 bg-teal-500/10 text-teal-300",
        review: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        design: "border-purple-500/20 bg-purple-500/10 text-purple-300",
        development: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        general: "border-slate-500/20 bg-slate-500/10 text-slate-300",
        low: "border-slate-500/20 bg-slate-500/10 text-slate-400",
        medium: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        high: "border-orange-500/20 bg-orange-500/10 text-orange-300",
        urgent: "border-red-500/20 bg-red-500/10 text-red-300",
        Low: "border-slate-500/20 bg-slate-500/10 text-slate-400",
        Medium: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        High: "border-orange-500/20 bg-orange-500/10 text-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
