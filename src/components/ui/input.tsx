import * as React from "react";
import { cn } from "@/lib/utils";

const inputClassName =
  "flex h-10 w-full rounded-lg border border-input bg-field px-3 py-2 text-sm text-field-foreground shadow-inner shadow-black/20 transition-colors placeholder:text-muted-foreground caret-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14] disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputClassName, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
