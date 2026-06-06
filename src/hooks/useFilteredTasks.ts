import { useMemo } from 'react';
import { useBoardStore } from '../store/boardStore';
import { filterTasks } from '../utils/filterTasks';
import type { Task } from '../types';

/**
 * Returns the filtered tasks grouped by column id, recomputed only
 * when the task list or filters change. Columns map to an ordered
 * array of their visible tasks, preserving board order.
 */
export function useFilteredTasksByColumn(): Record<string, Task[]> {
  const tasks = useBoardStore((s) => s.tasks);
  const filters = useBoardStore((s) => s.filters);

  return useMemo(() => {
    const visible = filterTasks(tasks, filters);
    return visible.reduce<Record<string, Task[]>>((acc, task) => {
      (acc[task.columnId] ??= []).push(task);
      return acc;
    }, {});
  }, [tasks, filters]);
}
