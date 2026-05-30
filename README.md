# Intelligent Task Orchestrator

**Transform ideas into execution plans.**

A production-ready AI-powered execution planning platform built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and dnd-kit. Turn project ideas into structured Kanban workflows with categorized tasks, drag-and-drop, and local persistence.

![Dark premium SaaS UI](https://img.shields.io/badge/Theme-Dark%20Navy-indigo)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Dashboard** — Hero section, stats cards, recent projects, create project flow
- **Project Workspace** — Kanban board (To Do → In Progress → Review → Done)
- **Project CRUD** — Create, view, edit, delete via modal dialogs
- **Task CRUD** — Full task fields with priority, category, status, due date
- **Magic Generate** — AI execution plan: 5 categorized subtasks from project title
- **Drag & Drop** — dnd-kit powered column moves with smooth animations
- **Persistence** — localStorage with hydration-safe client store
- **Responsive** — Desktop sidebar, tablet 2-column board, mobile stacked columns

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| DnD | @dnd-kit/core, @dnd-kit/sortable |
| Icons | Lucide React |
| State | React Context + localStorage |

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repository in the [Vercel Dashboard](https://vercel.com).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   └── projects/
│       ├── page.tsx        # All projects
│       └── [id]/page.tsx   # Project workspace
├── components/
│   ├── ai/                 # Magic Generate
│   ├── dashboard/          # Hero, stats
│   ├── kanban/             # Board & columns
│   ├── layout/             # Shell, sidebar, toaster
│   ├── projects/           # Project cards & dialogs
│   ├── tasks/              # Task cards & dialogs
│   ├── providers/          # App context
│   ├── shared/               # Empty states, stats
│   └── ui/                 # shadcn primitives
├── hooks/                  # useAppStore, useToast
├── lib/                    # Utils, constants, date
├── services/               # storage, ai-plan
└── types/                  # TypeScript definitions
```

## Usage Guide

1. **Create a project** from the Dashboard or Projects page.
2. Open the **project workspace**.
3. Click **Generate Execution Plan** to auto-create 5 categorized tasks in To Do.
4. **Drag tasks** between columns or use Edit to change status.
5. Use **Add Task** for manual task creation.
6. Data persists automatically in **localStorage**.

## Design System

- Deep navy background (`#070b14`)
- Indigo / purple accent gradients
- Glassmorphism cards with backdrop blur
- Hover lift microinteractions
- Linear / Notion / Vercel inspired hierarchy

## Documentation

See [AI_WORKFLOW.md](./AI_WORKFLOW.md) for AI-assisted development workflow, scaffold prompt, and recommended commit history.

## License

MIT
