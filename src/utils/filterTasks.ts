import type { BoardFilters, Task } from '../types';

/**
 * Apply search + priority filters to a task list. Search matches
 * title OR description (case-insensitive); priority filter narrows
 * to the selected set. Both are combined with AND so search and
 * filter work together. An empty filter set means "all".
 */
export function filterTasks(tasks: Task[], filters: BoardFilters): Task[] {
  const query = filters.query.trim().toLowerCase();
  const { priorities } = filters;

  if (!query && priorities.length === 0) return tasks;

  return tasks.filter((task) => {
    const matchesPriority =
      priorities.length === 0 || priorities.includes(task.priority);

    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    return matchesPriority && matchesQuery;
  });
}

/** Number of active filter facets — drives the "filters active" badge. */
export function countActiveFilters(filters: BoardFilters): number {
  return (filters.query.trim() ? 1 : 0) + filters.priorities.length;
}
