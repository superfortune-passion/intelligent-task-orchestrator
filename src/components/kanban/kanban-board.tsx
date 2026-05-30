"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  TASK_STATUSES,
  isValidTaskStatus,
  statusFromColumnId,
  type Task,
  type TaskStatus,
} from "@/types/task";
import { KanbanBoardHeader } from "@/components/kanban/kanban-board-header";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/tasks/task-card";
import type { MagicGenerateState } from "@/hooks/use-magic-generate";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus, order: number) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  searchQuery: string;
  filterPriority: string;
  filterCategory: string;
  isGenerating?: boolean;
  newTaskIds?: string[];
  magicState: MagicGenerateState;
  magicError: string;
  onMagicGenerate: () => void;
}

export function KanbanBoard({
  tasks,
  onMoveTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  searchQuery,
  filterPriority,
  filterCategory,
  isGenerating = false,
  newTaskIds = [],
  magicState,
  magicError,
  onMagicGenerate,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || t.priority === filterPriority;
      const matchesCategory =
        filterCategory === "all" || t.category === filterCategory;
      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, filterPriority, filterCategory]);

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      "To Do": [],
      "In Progress": [],
      Review: [],
      Done: [],
    };
    filteredTasks.forEach((t) => {
      const bucket: TaskStatus = isValidTaskStatus(t.status)
        ? t.status
        : "To Do";
      map[bucket].push(t);
    });
    (Object.keys(map) as TaskStatus[]).forEach((key) => {
      map[key].sort((a, b) => a.order - b.order);
    });
    return map;
  }, [filteredTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerHits = pointerWithin(args);
    if (pointerHits.length > 0) return pointerHits;
    return closestCorners(args);
  };

  const resolveDestinationStatus = (
    overId: string,
    allTasks: Task[]
  ): TaskStatus | null => {
    const fromColumn = statusFromColumnId(overId);
    if (fromColumn && isValidTaskStatus(fromColumn)) return fromColumn;

    const overTask = allTasks.find((t) => t.id === overId);
    if (overTask && isValidTaskStatus(overTask.status)) {
      return overTask.status;
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isGenerating) return;
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    if (isGenerating) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const task = tasks.find((t) => t.id === activeId);
    if (!task) return;

    const newStatus = resolveDestinationStatus(overId, tasks);
    if (!newStatus || !isValidTaskStatus(newStatus)) return;

    const destTasks = tasks
      .filter(
        (t) =>
          t.projectId === task.projectId &&
          t.status === newStatus &&
          t.id !== activeId
      )
      .sort((a, b) => a.order - b.order);

    let newOrder = destTasks.length;
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && overTask.id !== activeId) {
      newOrder = overTask.order;
    }

    if (task.status === newStatus && task.order === newOrder) return;

    onMoveTask(activeId, newStatus, newOrder);
  };

  return (
    <div>
      <KanbanBoardHeader
        taskCount={tasks.length}
        magicState={magicState}
        magicError={magicError}
        onMagicGenerate={onMagicGenerate}
        onAddTask={() => onAddTask("To Do")}
        isGenerating={isGenerating}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-6">
          {TASK_STATUSES.map((col) => {
            const showSkeleton = isGenerating && col.id === "To Do";
            return (
              <SortableContext
                key={col.id}
                items={tasksByStatus[col.id].map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  title={col.label}
                  status={col.id}
                  count={
                    showSkeleton
                      ? tasksByStatus[col.id].length + 5
                      : tasksByStatus[col.id].length
                  }
                  tasks={tasksByStatus[col.id]}
                  isLoading={showSkeleton}
                  skeletonCount={5}
                  newTaskIds={newTaskIds}
                  onAddTask={onAddTask}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  addTaskDisabled={isGenerating}
                />
              </SortableContext>
            );
          })}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 250,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
