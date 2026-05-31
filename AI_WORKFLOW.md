# AI Development Workflow

How **Intelligent Task Orchestrator** was built with **Cursor** (Composer / Agent) and Claude, including scaffold prompts, defect resolution, efficiency metrics, and an industry-standard Git history.

---

## 1. Initial Cursor scaffold prompt

The following prompt was used to generate the foundation in a single Composer session:

```
Build a production-ready SaaS web app called "Intelligent Task Orchestrator".

Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, dnd-kit, localStorage, Lucide.

Design: Premium dark theme, deep navy, purple/indigo accents, glassmorphism, Linear/Notion/Vercel inspired. NOT generic admin UI.

Screens:
1. Dashboard — hero, stats, recent projects, create project
2. Project Workspace — header, search, filters, Kanban (To Do, In Progress, Review, Done)

Features:
- Project CRUD (modals, localStorage)
- Task CRUD (title, description, category, priority, status, due date)
- Magic Generate — 5 categorized AI subtasks from project title, loading/skeleton/error/retry states
- dnd-kit drag between columns
- Toast notifications, empty states, responsive (mobile stacked columns)

Tagline: "Transform ideas into execution plans."

Organize by feature folders: components, hooks, services, types.
Generate README.md and AI_WORKFLOW.md.
```

Follow-up prompts were **feature-scoped** (e.g. “implement Task CRUD and Kanban with dnd-kit”, “add Magic Generate with skeletons and toasts”) rather than one monolithic rewrite.

---

## 2. Claude bug instance and fix

### Bug: Tasks disappeared when dragging across Kanban columns

**Symptom:** After dragging a task from one column to another, the task vanished from the board (and sometimes from persisted state after refresh).

**Cause (AI-generated `onDragEnd`):** The handler treated invalid or column-level drop IDs inconsistently, and in some paths updated status without preserving the task in the `tasks` array, or filtered with a stale index. Column-only drops were not always resolved to a valid `TaskStatus`.

**Follow-up prompt used:**

```
Fix Kanban drag-and-drop: tasks must never be removed on drag.
Validate drop target (column id or task id), update status and order via moveTask in the store, and support empty column drops.
Preserve all tasks in localStorage.
```

**Manual fix (summary):**

- Registered each column as a **droppable** with id `column-{status}`.
- Centralized destination resolution (`statusFromColumnId`, `isValidTaskStatus`).
- Implemented `moveTask` in `use-app-store.ts` to reindex tasks in the source column, insert at the target index, and assign status—never `filter` out the moved id.

```typescript
// kanban-board.tsx — resolve column vs card drop
const newStatus = resolveDestinationStatus(overId, tasks);
if (!newStatus) return;
onMoveTask(activeId, newStatus, newOrder);
```

**Lesson:** For dnd-kit, always pair **sortable items** with **column droppables** and keep state updates in one pure `moveTask` function. Ask AI to prove invariants: “task count unchanged after drag.”

---

### Bug: Hydration mismatch on dashboard stats

**Symptom:** React hydration warning—server rendered `0` projects while the client showed counts from `localStorage`.

**Cause:** Reading storage during initial render on the client while SSR used empty defaults.

**Fix:** `useLayoutEffect` to load storage once, `hydrated` flag, skeleton UI until true (see `use-app-store.ts`, `dashboard-loading.tsx`).

---

## 3. Efficiency metric (with vs without AI)

| Workstream | Without AI (estimate) | With Cursor + Claude | Time saved |
|------------|------------------------|----------------------|------------|
| Scaffold, config, folder structure | 2.5 h | 20 min | ~87% |
| shadcn/ui + layout shell | 3 h | 35 min | ~81% |
| Project + Task CRUD modals | 3 h | 45 min | ~75% |
| Kanban + dnd-kit + moveTask | 4 h | 1 h | ~75% |
| Magic Generate + API + UX states | 2.5 h | 35 min | ~77% |
| Dark theme + responsive polish | 3 h | 1 h | ~67% |
| Dev stability (HMR, hydration, errors) | 2 h | 1 h | ~50% |
| README + AI_WORKFLOW | 1.5 h | 25 min | ~72% |
| **Total** | **~21.5 h** | **~5.5 h** | **~74%** |

**Interpretation:** AI removed most boilerplate (components, types, repetitive JSX). Human time went to **correctness** (drag-and-drop, hydration), **design cohesion**, and **verification** (`npm run build`, manual QA on mobile widths).

---

## 4. Development workflow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Scoped prompt│ ──► │ Generate / edit │ ──► │ npm run dev  │
│ (one feature)│     │ in Cursor       │     │ or dev:fresh │
└──────────────┘     └─────────────────┘     └──────┬───────┘
                                                    │
                     ┌─────────────────┐            ▼
                     │ Fix prompt or   │ ◄── lint / build / QA
                     │ manual patch    │
                     └────────┬────────┘
                              ▼
                     ┌─────────────────┐
                     │ git commit      │  feat: | fix: | refactor: | docs:
                     │ (small, clear)  │
                     └────────┬────────┘
                              ▼
                     ┌─────────────────┐
                     │ vercel --prod   │
                     └─────────────────┘
```

### Practices that worked

1. **Types and services first** — `Project`, `Task`, `storage.ts` before UI.
2. **One feature per commit** — matches review expectations and bisect-friendly history.
3. **Build after each feature** — `npm run build` caught Tailwind `@apply` and type errors early.
4. **Explicit invariants in prompts** — e.g. “task count unchanged after drag”, “hydration-safe localStorage”.
5. **Design pass last** — spacing, hover, Kanban breakpoints, toasts.

---

## 5. Git workflow & commit history

Conventional Commits with **frequent, descriptive messages** (as required for submission):

```text
feat: scaffold intelligent task orchestrator with Cursor Composer
feat: implement Project CRUD with modal forms and localStorage
feat: fix Tailwind CSS import and global styling for premium dark dashboard
feat: implement Task CRUD and Kanban board with dnd-kit
feat: add AI-powered Magic Generate to Project Board
fix: preserve tasks when dragging across Kanban columns
feat: improve AI task generation quality and UX
feat: add task card edit and delete actions
feat: add task edit and delete actions with confirmation
refactor: replace placeholder team avatars with project metrics
refactor: polish responsive UI and interaction states
docs: add professional project README
```

Example commands:

```bash
git add src/components/kanban/
git commit -m "feat: implement Task CRUD and Kanban board with dnd-kit"

git add src/hooks/use-app-store.ts src/components/kanban/kanban-board.tsx
git commit -m "fix: preserve tasks when dragging across Kanban columns"
```

---

## 6. Handoff checklist

- [x] `npm run build` passes
- [x] Create → Magic Generate → Drag → Persist flow works
- [x] Mobile Kanban: 1 column, no horizontal overflow
- [x] AI errors: toast + retry, app remains usable
- [x] `AI_WORKFLOW.md` documents prompt, bug fix, and efficiency
- [ ] **Live deployment** on Vercel or Netlify (add URL to README)
- [ ] **Screenshots** under `docs/screenshots/` (optional but recommended)

---

*Built with Cursor Agent — senior frontend assessment submission.*
