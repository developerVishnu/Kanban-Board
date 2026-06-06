import type { Column, Task } from '../types';

/**
 * Pure helper that produces a new task list with `taskId` moved to
 * `toColumnId` at column-local position `toIndex`.
 *
 * Tasks are stored as a flat array; only their order *within* a
 * column is meaningful (rendering filters by column). We therefore
 * rebuild the array column-by-column, which keeps the operation
 * deterministic and side-effect free — essential for correct DnD
 * state after every drag.
 */
export function moveTaskInList(
  tasks: Task[],
  columns: Column[],
  taskId: string,
  toColumnId: string,
  toIndex: number,
): Task[] {
  const moving = tasks.find((t) => t.id === taskId);
  if (!moving) return tasks;

  const updatedMoving: Task = { ...moving, columnId: toColumnId };
  const result: Task[] = [];

  for (const col of columns) {
    let slice = tasks.filter((t) => t.columnId === col.id && t.id !== taskId);

    if (col.id === toColumnId) {
      const idx = Math.max(0, Math.min(toIndex, slice.length));
      slice = [...slice.slice(0, idx), updatedMoving, ...slice.slice(idx)];
    }

    result.push(...slice);
  }

  return result;
}
