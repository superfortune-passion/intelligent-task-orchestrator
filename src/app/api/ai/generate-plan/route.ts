import { NextResponse } from "next/server";
import {
  buildTemplatePlan,
  finalizeGeneratedPlan,
  parseGeneratedTasksJson,
} from "@/services/ai-plan";
import type { GeneratePlanResult } from "@/types/ai";

const SYSTEM_PROMPT = `You are a senior execution planner. Given a project title and optional existing task titles, produce exactly 5 NEW professional subtasks as a JSON array.

Rules:
- Tasks must be specific to the project title (e.g. "Deploy into Vercel" → Vercel env vars, DNS, smoke tests, monitoring).
- NEVER repeat or paraphrase existing task titles.
- NEVER use generic filler like "Define project timeline — Project Name" or append the project name to a generic template.
- Each title must be unique, actionable, and under 90 characters.
- Use each category once: Research, Planning, Marketing, Operations, Review (one task per category).
- Write concise one-sentence descriptions.

Each object:
- "title" (string)
- "category" (Research | Planning | Marketing | Operations | Review)
- "description" (string)
- "priority" (High | Medium | Low)

Return ONLY a valid JSON array, no markdown.`;

function buildUserPrompt(
  projectTitle: string,
  existingTaskTitles: string[]
): string {
  const existing =
    existingTaskTitles.length > 0
      ? `\nExisting tasks (do NOT duplicate):\n${existingTaskTitles.map((t) => `- ${t}`).join("\n")}`
      : "\nNo existing tasks yet.";

  return `Project title: "${projectTitle.trim()}"${existing}\n\nGenerate 5 unique, professional execution subtasks tailored to this project.`;
}

async function generateWithClaude(
  projectTitle: string,
  existingTaskTitles: string[]
): Promise<GeneratePlanResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const tasks = buildTemplatePlan(projectTitle, existingTaskTitles);
    return tasks.length > 0
      ? { success: true, tasks }
      : {
          success: false,
          error:
            "All suggested tasks already exist. Try renaming tasks or use a different project focus.",
        };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-20241022",
        max_tokens: 1400,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(projectTitle, existingTaskTitles),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error", await response.text());
      const tasks = buildTemplatePlan(projectTitle, existingTaskTitles);
      return tasks.length > 0
        ? { success: true, tasks }
        : { success: false, error: "AI generation failed" };
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const parsed = parseGeneratedTasksJson(text);

    if (parsed) {
      const tasks = finalizeGeneratedPlan(
        parsed,
        projectTitle,
        existingTaskTitles
      );
      if (tasks.length > 0) return { success: true, tasks };
    }

    const fallback = buildTemplatePlan(projectTitle, existingTaskTitles);
    return fallback.length > 0
      ? { success: true, tasks: fallback }
      : { success: false, error: "AI generation failed" };
  } catch (err) {
    console.error("Claude generation failed", err);
    const tasks = buildTemplatePlan(projectTitle, existingTaskTitles);
    return tasks.length > 0
      ? { success: true, tasks }
      : { success: false, error: "AI generation failed" };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      projectTitle?: string;
      existingTaskTitles?: string[];
    };
    const projectTitle = body.projectTitle?.trim() ?? "";
    const existingTaskTitles = Array.isArray(body.existingTaskTitles)
      ? body.existingTaskTitles.filter(
          (t): t is string => typeof t === "string" && t.trim().length > 0
        )
      : [];

    if (!projectTitle) {
      return NextResponse.json(
        {
          success: false,
          error: "Project title is required.",
        } satisfies GeneratePlanResult,
        { status: 400 }
      );
    }

    const result = await generateWithClaude(projectTitle, existingTaskTitles);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "AI generation failed",
      } satisfies GeneratePlanResult,
      { status: 500 }
    );
  }
}
