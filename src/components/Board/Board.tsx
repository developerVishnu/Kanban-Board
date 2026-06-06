import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '../../store/boardStore';
import { useFilteredTasksByColumn } from '../../hooks/useFilteredTasks';
import { countActiveFilters } from '../../utils/filterTasks';
import { Column } from '../Column';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../types';
import styles from './Board.module.scss';

/**
 * The board surface. Owns the DndContext and translates drag
 * results into store `moveTask` calls. Live reordering is computed
 * against the real (unfiltered) store order so state stays correct
 * regardless of any active search/filter.
 */
export function Board() {
  const columns = useBoardStore((s) => s.columns);
  const tasks = useBoardStore((s) => s.tasks);
  const filters = useBoardStore((s) => s.filters);
  const moveTask = useBoardStore((s) => s.moveTask);

  const tasksByColumn = useFilteredTasksByColumn();
  const isFiltering = countActiveFilters(filters) > 0;

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId) ?? null,
    [tasks, activeId],
  );

  // Movement constraint so a tap/click (to edit) doesn't start a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /** Real (unfiltered) tasks for a column, preserving board order. */
  const realColumnTasks = (columnId: string): Task[] =>
    tasks.filter((t) => t.columnId === columnId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    document.body.classList.add('dnd-dragging');
  };

  const finishDrag = () => {
    setActiveId(null);
    document.body.classList.remove('dnd-dragging');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    finishDrag();
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);
    if (activeTaskId === overId) return;

    const moving = tasks.find((t) => t.id === activeTaskId);
    if (!moving) return;

    const overType = over.data.current?.type as 'task' | 'column' | undefined;

    let toColumnId: string;
    let toIndex: number;

    if (overType === 'column') {
      // Dropped onto a column's empty area → append to its end.
      toColumnId = overId;
      toIndex = realColumnTasks(toColumnId).filter(
        (t) => t.id !== activeTaskId,
      ).length;
    } else {
      // Dropped onto another task → insert before it.
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      toColumnId = overTask.columnId;
      const destination = realColumnTasks(toColumnId).filter(
        (t) => t.id !== activeTaskId,
      );
      toIndex = destination.findIndex((t) => t.id === overId);
      if (toIndex === -1) toIndex = destination.length;
    }

    moveTask(activeTaskId, toColumnId, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={finishDrag}
    >
      <div className={styles.board}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id] ?? []}
            isFiltering={isFiltering}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
