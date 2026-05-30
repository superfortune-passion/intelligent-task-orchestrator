import { NextResponse } from "next/server";
import {
  buildTemplatePlan,
  parseGeneratedTasksJson,
} from "@/services/ai-plan";
import type { GeneratePlanResult } from "@/types/ai";

const SYSTEM_PROMPT = `You are an execution planning assistant. Given a project title, return exactly 5 subtasks as a JSON array.

Each object must have:
- "title" (string, actionable)
- "category" (one of: Research, Planning, Marketing, Operations, Review)
- "description" (string, one sentence)
- "priority" (optional: High, Medium, or Low)

Return ONLY valid JSON array, no markdown.`;

async function generateWithClaude(
  projectTitle: string
): Promise<GeneratePlanResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { success: true, tasks: buildTemplatePlan(projectTitle) };
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
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Project title: "${projectTitle.trim()}"\n\nGenerate 5 categorized execution subtasks.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error", await response.text());
      return { success: true, tasks: buildTemplatePlan(projectTitle) };
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const parsed = parseGeneratedTasksJson(text);

    if (parsed) {
      return { success: true, tasks: parsed };
    }

    return { success: true, tasks: buildTemplatePlan(projectTitle) };
  } catch (err) {
    console.error("Claude generation failed", err);
    return { success: true, tasks: buildTemplatePlan(projectTitle) };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { projectTitle?: string };
    const projectTitle = body.projectTitle?.trim() ?? "";

    if (!projectTitle) {
      return NextResponse.json(
        {
          success: false,
          error: "Project title is required.",
        } satisfies GeneratePlanResult,
        { status: 400 }
      );
    }

    const result = await generateWithClaude(projectTitle);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate execution plan. Please try again.",
      } satisfies GeneratePlanResult,
      { status: 500 }
    );
  }
}
