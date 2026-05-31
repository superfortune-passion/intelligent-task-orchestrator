"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isStaleChunk =
    error.message?.includes("Cannot find module") ||
    error.message?.includes("Loading chunk");

  return (
    <div className="app-gradient flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/25">
        <AlertCircle className="h-6 w-6 text-red-400" aria-hidden />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="typo-section-title">Something went wrong</h2>
        <p className="typo-muted">
          {isStaleChunk
            ? "The dev build cache is out of date. Stop the server, run npm run dev:fresh, then reload."
            : "An unexpected error occurred. You can try again or return to the dashboard."}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => reset()} className="primary-glow">
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
