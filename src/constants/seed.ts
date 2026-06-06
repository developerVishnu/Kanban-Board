import type { Task } from '../types';
import { createId } from '../utils/id';

const HOUR = 60 * 60 * 1000;
const now = Date.now();

/**
 * Sample tasks used to populate the board on first ever load, so a
 * new user sees a working example rather than empty columns. Once
 * the user edits the board, their persisted snapshot takes over.
 */
export const SEED_TASKS: Task[] = [
  {
    id: createId(),
    columnId: 'todo',
    title: 'Design onboarding flow',
    description: 'Wireframe the 3-step signup and gather feedback from design.',
    priority: 'high',
    assignee: 'Alex Kim',
    createdAt: now - 26 * HOUR,
  },
  {
    id: createId(),
    columnId: 'todo',
    title: 'Audit accessibility',
    description: 'Run axe across all pages and log issues for the a11y sprint.',
    priority: 'low',
    assignee: 'Priya Shah',
    createdAt: now - 5 * HOUR,
  },
  {
    id: createId(),
    columnId: 'in-progress',
    title: 'Build drag-and-drop board',
    description: 'Implement column reordering with dnd-kit and persist state.',
    priority: 'urgent',
    assignee: 'Jordan Lee',
    createdAt: now - 2 * HOUR,
  },
  {
    id: createId(),
    columnId: 'in-review',
    title: 'Wire up REST persistence',
    description: 'Swap the localStorage adapter for the new /api/board client.',
    priority: 'medium',
    assignee: 'Sam Rivera',
    createdAt: now - 30 * HOUR,
  },
  {
    id: createId(),
    columnId: 'done',
    title: 'Set up CI pipeline',
    description: 'Lint, type-check and build on every pull request.',
    priority: 'medium',
    assignee: 'Chris Doe',
    createdAt: now - 72 * HOUR,
  },
];
