import type { Column } from '../types';

/**
 * Default board columns. The board is column-agnostic — it renders
 * whatever columns the store holds — so extending the board later
 * (e.g. a "Blocked" lane) only requires adding an entry here or
 * dispatching an add-column action.
 */
export const DEFAULT_COLUMNS: readonly Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'in-review', title: 'In Review' },
  { id: 'done', title: 'Done' },
] as const;
