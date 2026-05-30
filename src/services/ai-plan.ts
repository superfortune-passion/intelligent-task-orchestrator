export interface GeneratedSubtask {
  category: string;
  title: string;
  description: string;
}

export type GeneratePlanResult =
  | { success: true; tasks: GeneratedSubtask[] }
  | { success: false; error: string };

const CATEGORY_TEMPLATES: Record<
  string,
  { category: string; title: string; description: string }[]
> = {
  launch: [
    {
      category: "Research",
      title: "Research target audience and market positioning",
      description:
        "Analyze customer segments, competitors, and market gaps to define your launch positioning.",
    },
    {
      category: "Planning",
      title: "Define launch timeline and milestones",
      description:
        "Create a phased rollout schedule with key dates, dependencies, and go/no-go checkpoints.",
    },
    {
      category: "Marketing",
      title: "Create marketing assets and campaign brief",
      description:
        "Develop messaging, creative assets, and channel strategy for pre-launch and launch day.",
    },
    {
      category: "Operations",
      title: "Schedule launch event and logistics",
      description:
        "Coordinate venues, vendors, inventory, and support teams for a smooth launch execution.",
    },
    {
      category: "Review",
      title: "Measure launch performance and iterate",
      description:
        "Track KPIs, gather feedback, and document learnings for post-launch optimization.",
    },
  ],
  redesign: [
    {
      category: "Research",
      title: "Audit current site and gather user feedback",
      description:
        "Review analytics, heatmaps, and user interviews to identify pain points and opportunities.",
    },
    {
      category: "Design",
      title: "Create wireframes and visual design system",
      description:
        "Develop responsive layouts, component library, and brand-consistent UI patterns.",
    },
    {
      category: "Planning",
      title: "Plan content migration and URL structure",
      description:
        "Map existing content, define information architecture, and plan SEO redirects.",
    },
    {
      category: "Development",
      title: "Implement frontend and integrate CMS",
      description:
        "Build responsive pages, optimize performance, and connect content management workflows.",
    },
    {
      category: "Review",
      title: "Conduct QA and stakeholder sign-off",
      description:
        "Run cross-browser testing, accessibility audit, and final approval before launch.",
    },
  ],
  marketing: [
    {
      category: "Research",
      title: "Define campaign audience and objectives",
      description:
        "Identify target personas, set SMART goals, and align metrics with business outcomes.",
    },
    {
      category: "Planning",
      title: "Build campaign calendar and budget",
      description:
        "Schedule content drops, ad flights, and allocate resources across channels.",
    },
    {
      category: "Marketing",
      title: "Produce campaign creative and copy",
      description:
        "Design ads, landing pages, email sequences, and social content for each channel.",
    },
    {
      category: "Operations",
      title: "Set up tracking and automation",
      description:
        "Configure UTM parameters, conversion pixels, and email/automation workflows.",
    },
    {
      category: "Review",
      title: "Analyze campaign results and report",
      description:
        "Compile performance dashboards, ROI analysis, and recommendations for next cycle.",
    },
  ],
  mobile: [
    {
      category: "Research",
      title: "Validate app concept and technical requirements",
      description:
        "Define MVP scope, platform targets (iOS/Android), and third-party integrations.",
    },
    {
      category: "Design",
      title: "Design user flows and high-fidelity screens",
      description:
        "Create interactive prototypes covering onboarding, core flows, and edge cases.",
    },
    {
      category: "Development",
      title: "Build core features and API integration",
      description:
        "Implement authentication, data layer, and primary user journeys with test coverage.",
    },
    {
      category: "Operations",
      title: "Prepare app store listings and release pipeline",
      description:
        "Write store copy, screenshots, CI/CD pipeline, and beta distribution strategy.",
    },
    {
      category: "Review",
      title: "Beta test and polish for production release",
      description:
        "Run TestFlight/Play Console beta, fix critical bugs, and finalize launch checklist.",
    },
  ],
  default: [
    {
      category: "Research",
      title: "Research scope and stakeholder requirements",
      description:
        "Gather requirements, constraints, and success criteria from all stakeholders.",
    },
    {
      category: "Planning",
      title: "Define project timeline and deliverables",
      description:
        "Break work into phases with milestones, owners, and dependency mapping.",
    },
    {
      category: "Marketing",
      title: "Align messaging and communication plan",
      description:
        "Draft internal and external communications for key project milestones.",
    },
    {
      category: "Operations",
      title: "Set up tools, processes, and team workflows",
      description:
        "Configure project tools, meeting cadence, and handoff procedures.",
    },
    {
      category: "Review",
      title: "Review outcomes and document learnings",
      description:
        "Conduct retrospective, measure against goals, and capture actionable insights.",
    },
  ],
};

function detectProjectType(title: string): keyof typeof CATEGORY_TEMPLATES {
  const lower = title.toLowerCase();
  if (
    lower.includes("launch") ||
    lower.includes("product") ||
    lower.includes("go-to-market")
  )
    return "launch";
  if (
    lower.includes("redesign") ||
    lower.includes("website") ||
    lower.includes("web")
  )
    return "redesign";
  if (
    lower.includes("marketing") ||
    lower.includes("campaign") ||
    lower.includes("brand")
  )
    return "marketing";
  if (
    lower.includes("mobile") ||
    lower.includes("app") ||
    lower.includes("ios") ||
    lower.includes("android")
  )
    return "mobile";
  return "default";
}

function personalizeTasks(
  title: string,
  templates: GeneratedSubtask[]
): GeneratedSubtask[] {
  const projectName = title.trim() || "this project";
  return templates.map((task) => ({
    ...task,
    title: task.title.replace(/your |the /gi, (m) =>
      m.toLowerCase() === "your " ? `${projectName} ` : `${projectName} `
    ),
    description: `${task.description} Tailored for: ${projectName}.`,
  }));
}

export async function generateExecutionPlan(
  projectTitle: string,
  options?: { forceError?: boolean }
): Promise<GeneratePlanResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1400 + Math.random() * 800)
  );

  if (options?.forceError) {
    return {
      success: false,
      error: "Generation service temporarily unavailable. Please retry.",
    };
  }

  if (!projectTitle.trim()) {
    return {
      success: false,
      error: "Project title is required to generate an execution plan.",
    };
  }

  try {
    const type = detectProjectType(projectTitle);
    const templates = CATEGORY_TEMPLATES[type] ?? CATEGORY_TEMPLATES.default;
    const tasks = personalizeTasks(projectTitle, templates);
    return { success: true, tasks };
  } catch {
    return {
      success: false,
      error: "Failed to generate execution plan. Please try again.",
    };
  }
}
