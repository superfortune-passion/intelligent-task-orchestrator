import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateProjectButtonProps {
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function CreateProjectButton({
  onClick,
  className,
  size = "default",
}: CreateProjectButtonProps) {
  return (
    <Button
      onClick={onClick}
      size={size}
      className={cn("w-full sm:w-auto justify-center", className)}
    >
      + Create Project
    </Button>
  );
}
