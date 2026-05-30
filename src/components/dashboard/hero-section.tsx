import { Sparkles, ArrowRight } from "lucide-react";
import { APP_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onCreateProject: () => void;
}

export function HeroSection({ onCreateProject }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Execution Planning
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-4">
          Intelligent Task Orchestrator
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {APP_TAGLINE} Turn project ideas into structured Kanban workflows
          with categorized tasks, priorities, and drag-and-drop execution.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={onCreateProject} className="gap-2">
            Create Project
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#recent-projects">View Projects</a>
          </Button>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-12 top-8 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
    </section>
  );
}
