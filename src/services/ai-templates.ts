import type { AiPlanCategory } from "@/types/ai";
import type { TaskPriority } from "@/types/task";

export interface PlanTemplate {
  category: AiPlanCategory;
  title: string;
  description: string;
  priority: TaskPriority;
}

/** Primary + alternate pools per project archetype */
export const PROJECT_PLAN_POOLS: Record<string, PlanTemplate[]> = {
  deploy: [
    {
      category: "Research",
      title: "Audit deployment requirements and platform constraints",
      description:
        "Document runtime, build output, domains, SSL, and compliance needs before shipping.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Configure environment variables for preview and production",
      description:
        "Define secrets, feature flags, and per-environment values with a rotation checklist.",
      priority: "High",
    },
    {
      category: "Operations",
      title: "Set up Vercel project settings and deployment pipeline",
      description:
        "Connect the repository, configure build commands, regions, and branch previews.",
      priority: "High",
    },
    {
      category: "Operations",
      title: "Run production deployment smoke tests",
      description:
        "Validate critical paths, API health, and asset delivery on the live URL.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Verify monitoring, alerts, and rollback strategy",
      description:
        "Confirm observability dashboards, error tracking, and a documented rollback plan.",
      priority: "Medium",
    },
    {
      category: "Planning",
      title: "Map DNS, custom domain, and CDN caching rules",
      description:
        "Configure apex/subdomain records, HTTPS, and cache headers for static assets.",
      priority: "Medium",
    },
    {
      category: "Research",
      title: "Benchmark build times and bundle size budgets",
      description:
        "Establish performance baselines to catch regressions on each deploy.",
      priority: "Low",
    },
    {
      category: "Operations",
      title: "Document release checklist and on-call handoff",
      description:
        "Publish deploy steps, owners, and escalation paths for the team.",
      priority: "Low",
    },
  ],
  launch: [
    {
      category: "Research",
      title: "Validate positioning with customer interviews",
      description:
        "Run structured interviews to confirm problem, solution fit, and messaging angles.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Build phased launch timeline with owners",
      description:
        "Sequence beta, soft launch, and GA with dependencies and go/no-go gates.",
      priority: "High",
    },
    {
      category: "Marketing",
      title: "Draft launch narrative and channel playbook",
      description:
        "Prepare email, social, and partner announcements aligned to launch day.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Prepare support macros and status page updates",
      description:
        "Equip support with FAQs, macros, and incident comms templates.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Define launch KPIs and post-launch retrospective",
      description:
        "Track activation, conversion, and qualitative feedback for week-one review.",
      priority: "Low",
    },
    {
      category: "Marketing",
      title: "Produce demo assets and landing page variants",
      description:
        "Ship screenshots, short demo video, and A/B hero copy for the launch site.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Run launch readiness war room dry run",
      description:
        "Simulate launch day roles, comms cadence, and rollback triggers.",
      priority: "High",
    },
  ],
  marketing: [
    {
      category: "Research",
      title: "Analyze audience segments and channel fit",
      description:
        "Prioritize channels by reach, cost, and intent using recent performance data.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Define campaign objectives and success metrics",
      description:
        "Set SMART goals, primary KPIs, and reporting cadence for stakeholders.",
      priority: "High",
    },
    {
      category: "Marketing",
      title: "Create creative brief and asset production schedule",
      description:
        "Align copy, visuals, and formats to each channel before production starts.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Configure tracking, UTMs, and conversion pixels",
      description:
        "Ensure attribution works across ads, email, and landing pages.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Compile campaign performance report and next steps",
      description:
        "Summarize ROI, learnings, and experiments for the following cycle.",
      priority: "Low",
    },
    {
      category: "Marketing",
      title: "Draft nurture email sequence and subject line tests",
      description:
        "Plan a three-touch sequence with A/B subjects and clear CTAs.",
      priority: "Medium",
    },
  ],
  product: [
    {
      category: "Research",
      title: "Synthesize user feedback into problem statements",
      description:
        "Cluster support tickets and interviews into prioritized pain points.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Write PRD with scope, risks, and acceptance criteria",
      description:
        "Document in-scope features, non-goals, and measurable acceptance tests.",
      priority: "High",
    },
    {
      category: "Operations",
      title: "Break down epics into sprint-ready user stories",
      description:
        "Estimate work, define dependencies, and assign owners per story.",
      priority: "Medium",
    },
    {
      category: "Operations",
      title: "Ship beta behind feature flag with telemetry",
      description:
        "Enable controlled rollout with event tracking for core flows.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Run UAT and sign-off with stakeholders",
      description:
        "Collect structured sign-off against acceptance criteria before release.",
      priority: "Low",
    },
    {
      category: "Planning",
      title: "Align design specs with engineering feasibility review",
      description:
        "Resolve open UX questions and document API contracts early.",
      priority: "Medium",
    },
  ],
  default: [
    {
      category: "Research",
      title: "Clarify goals, constraints, and success metrics",
      description:
        "Align stakeholders on outcomes, deadlines, and definition of done.",
      priority: "High",
    },
    {
      category: "Planning",
      title: "Draft work breakdown and milestone schedule",
      description:
        "Sequence deliverables with owners, buffers, and dependency notes.",
      priority: "High",
    },
    {
      category: "Operations",
      title: "Set up tooling, access, and workflow handoffs",
      description:
        "Provision repos, boards, and communication norms for the team.",
      priority: "Medium",
    },
    {
      category: "Marketing",
      title: "Prepare stakeholder updates and status templates",
      description:
        "Create a lightweight weekly update format for sponsors and partners.",
      priority: "Medium",
    },
    {
      category: "Review",
      title: "Run retrospective and capture actionable improvements",
      description:
        "Document what worked, blockers, and changes for the next iteration.",
      priority: "Low",
    },
    {
      category: "Planning",
      title: "Identify risks and mitigation owners",
      description:
        "Log top risks with triggers, mitigations, and accountable owners.",
      priority: "High",
    },
    {
      category: "Operations",
      title: "Define quality checklist before marking work complete",
      description:
        "Standardize review steps so deliverables meet agreed standards.",
      priority: "Medium",
    },
  ],
};

export function detectProjectArchetype(title: string): string {
  const lower = title.toLowerCase();

  if (
    lower.includes("vercel") ||
    lower.includes("deploy") ||
    lower.includes("production") ||
    lower.includes("release") ||
    lower.includes("ci/cd") ||
    lower.includes("hosting") ||
    lower.includes("aws") ||
    lower.includes("netlify") ||
    lower.includes("railway")
  ) {
    return "deploy";
  }

  if (
    lower.includes("launch") ||
    lower.includes("go-to-market") ||
    lower.includes("gtm") ||
    lower.includes("ship")
  ) {
    return "launch";
  }

  if (
    lower.includes("marketing") ||
    lower.includes("campaign") ||
    lower.includes("brand") ||
    lower.includes("ads")
  ) {
    return "marketing";
  }

  if (
    lower.includes("product") ||
    lower.includes("feature") ||
    lower.includes("roadmap") ||
    lower.includes("mvp") ||
    lower.includes("sprint")
  ) {
    return "product";
  }

  return "default";
}

/** Contextual one-off fillers when pools are exhausted */
export function buildContextualFillers(
  projectTitle: string,
  index: number
): PlanTemplate {
  const name = projectTitle.trim() || "the initiative";
  const fillers: PlanTemplate[] = [
    {
      category: "Planning",
      title: `Define scope boundaries for ${name}`,
      description: `Document in-scope outcomes and explicit non-goals for ${name}.`,
      priority: "High",
    },
    {
      category: "Operations",
      title: `Establish weekly execution cadence for ${name}`,
      description: `Set standups, blockers review, and decision logs tied to ${name}.`,
      priority: "Medium",
    },
    {
      category: "Research",
      title: `Gather inputs and assumptions for ${name}`,
      description: `List unknowns, data sources, and validation steps before build work.`,
      priority: "High",
    },
    {
      category: "Review",
      title: `Schedule stakeholder demo for ${name}`,
      description: `Present progress, risks, and next milestones to sponsors.`,
      priority: "Low",
    },
    {
      category: "Operations",
      title: `Create runbook for handoff on ${name}`,
      description: `Capture operational steps so others can support ${name} without you.`,
      priority: "Medium",
    },
  ];
  return fillers[index % fillers.length];
}
