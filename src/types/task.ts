/**
 * Priority levels a task can be assigned. Ordered loosely from
 * least to most urgent; the union is the single source of truth.
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * A single Kanban task card.
 */
export interface Task {
  id: string;
  /** Id of the column this task currently belongs to. */
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  /** Epoch milliseconds the task was created. */
  createdAt: number;
}

/**
 * The editable subset of a task — what a create/edit form produces.
 * `columnId` is set by the store (defaults to the first column on create).
 */
export type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'priority' | 'assignee'
>;
