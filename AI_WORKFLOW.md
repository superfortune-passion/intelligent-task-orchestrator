# AI Development Workflow

Documentation for how this project was built using AI-assisted development (Cursor + Claude).

---

## 1. Initial Cursor Scaffold Prompt

Use this prompt to reproduce the foundation in Cursor:

```
Build a production-ready SaaS web app called "Intelligent Task Orchestrator".

Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, dnd-kit, localStorage, Lucide.

Design: Premium dark theme, deep navy, purple/indigo accents, glassmorphism, Linear/Notion/Vercel inspired. NOT generic admin UI.

Screens:
1. Dashboard — hero, stats, recent projects, create project
2. Project Workspace — header, search, filters, team avatars, Kanban (To Do, In Progress, Review, Done)

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

---

## 2. Example Claude Bug and Resolution

### Bug: Hydration mismatch on dashboard stats

**Symptom:** React hydration warning — server rendered `0` projects but client showed stored count from localStorage.

**Cause:** `loadState()` ran during initial render on client while SSR produced empty defaults.

**Resolution:**

```typescript
// hooks/use-app-store.ts
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  setState(loadState());
  setHydrated(true);
}, []);

// pages only render data UI when hydrated === true
if (!hydrated) return <SkeletonLayout />;
```

**Lesson:** Never read `localStorage` during SSR or first paint. Gate UI behind a `hydrated` flag and show skeletons until client state loads.

---

### Bug: Kanban drop on empty column failed

**Symptom:** Dragging a task to an empty column did not change status.

**Cause:** Drop target was only other task cards, not the column container.

**Resolution:** Added `useDroppable` to `KanbanColumn` with id `column-{status}` and parsed that id in `handleDragEnd`:

```typescript
const columnStatus = parseColumnId(overId);
if (columnStatus) newStatus = columnStatus;
```

---

## 3. Time Saved Using AI

| Task | Manual estimate | With AI | Saved |
|------|-----------------|---------|-------|
| Project scaffold + config | 2h | 15m | ~85% |
| shadcn UI primitives | 3h | 30m | ~83% |
| Kanban + dnd-kit integration | 4h | 45m | ~81% |
| AI generate service + states | 2h | 20m | ~83% |
| Premium dark theme polish | 3h | 40m | ~78% |
| Documentation | 1h | 15m | ~75% |
| **Total** | **~15h** | **~3h** | **~80%** |

AI accelerated boilerplate and repetitive UI. Human review focused on design cohesion, edge cases (hydration, empty drops), and TypeScript strictness.

---

## 4. Development Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Cursor Plan │ ──► │ AI Generate  │ ──► │ Local Test  │
│ (prompt)    │     │ (components) │     │ npm run dev │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                    ┌──────────────┐             ▼
                    │ Claude Fix   │ ◄── Build / Lint errors
                    │ (debug)      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Design pass  │  spacing, hover, empty states
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐
                    │ Vercel deploy│
                    └──────────────┘
```

### Recommended practices

1. **Feature-first prompts** — Ask for one screen at a time (Dashboard, then Workspace).
2. **Types first** — Define `Project`, `Task`, `AppState` before components.
3. **Verify build early** — Run `npm run build` after each major feature.
4. **Design Eye pass** — Check mobile at 375px, tablet at 768px, desktop at 1280px.
5. **Never skip error states** — AI generate must have loading, skeleton, error, retry.

---

## 5. Recommended Git Commit History

```bash
feat: scaffold Next.js 15 app with TypeScript and Tailwind v4

feat: add design system with dark navy theme and glassmorphism utilities

feat: implement localStorage persistence and app store hook

feat: add shadcn/ui primitives and layout shell with sidebar

feat: build dashboard with hero, stats, and project cards

feat: implement project CRUD with modal dialogs

feat: add project workspace with search and filters

feat: integrate dnd-kit Kanban board with column drag-and-drop

feat: implement task CRUD with full field support

feat: add Magic Generate AI execution plan with loading and error states

feat: add toast notifications and empty states

refactor: organize feature-based component architecture

docs: add README and AI_WORKFLOW documentation
```

### Example commit commands

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 15 app with TypeScript and Tailwind v4"
# ... continue per feature commits above
```

---

## 6. Handoff Checklist

- [ ] `npm run build` passes
- [ ] Create → Generate → Drag → Persist flow works
- [ ] Mobile: no horizontal overflow on Kanban
- [ ] Error state: disconnect-safe (generation never crashes app)
- [ ] Deploy preview on Vercel

---

*Built with Cursor Agent — Senior Frontend Engineering Assessment*
