import { Sparkles, LayoutGrid } from "lucide-react";
import { APP_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CreateProjectButton } from "@/components/projects/create-project-button";

interface DashboardHeroProps {
  onCreateProject: () => void;
}

export function DashboardHero({ onCreateProject }: DashboardHeroProps) {
  return (
    <section className="relative mb-10 md:mb-12 overflow-hidden rounded-2xl border border-border/60 glass-card">
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.12] via-transparent to-violet-500/[0.08] pointer-events-none"
        aria-hidden
      />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/[0.04] to-transparent pointer-events-none hidden md:block" aria-hidden />

      <div className="relative z-10 grid gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-[1fr_minmax(220px,320px)] lg:gap-10 lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-indigo-300 mb-5">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">Execution planning workspace</span>
          </div>

          <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15] mb-4">
            <span className="text-gradient block break-words">
              Intelligent Task Orchestrator
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8 break-words">
            {APP_TAGLINE} Organize projects, track progress, and move work from idea
            to done with a structured workspace.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <CreateProjectButton
              onClick={onCreateProject}
              size="lg"
              className="sm:min-w-[180px]"
            />
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto justify-center"
            >
              <a href="#recent-projects">View Projects</a>
            </Button>
          </div>
        </div>

        <div
          className="hidden md:flex flex-col gap-3 min-w-0 rounded-xl border border-border/50 bg-background/40 p-4"
          aria-hidden
        >
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <LayoutGrid className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Your workspace</span>
          </div>
          <div className="space-y-2">
            {["To Do", "In Progress", "Review", "Done"].map((col, i) => (
              <div
                key={col}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: ["#94a3b8", "#818cf8", "#fbbf24", "#34d399"][i],
                  }}
                />
                <span className="text-sm text-foreground/90 truncate">{col}</span>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums shrink-0">
                  {i === 0 ? "—" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute right-8 top-6 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none hidden sm:block" aria-hidden />
    </section>
  );
}
