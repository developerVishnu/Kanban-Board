import { describe, it, expect } from 'vitest';
import type { Task } from '../types';
import { countActiveFilters, filterTasks } from './filterTasks';

const tasks: Task[] = [
  { id: '1', columnId: 'todo', title: 'Write tests', description: 'cover the store', priority: 'high', assignee: 'Alex', createdAt: 0 },
  { id: '2', columnId: 'todo', title: 'Fix bug', description: 'login crash', priority: 'urgent', assignee: 'Sam', createdAt: 0 },
];

describe('filterTasks', () => {
  it('returns all tasks when no filters are set', () => {
    expect(filterTasks(tasks, { query: '', priorities: [] })).toEqual(tasks);
  });

  it('filters by query (case-insensitive, title or description)', () => {
    expect(filterTasks(tasks, { query: 'LOGIN', priorities: [] })).toEqual([tasks[1]]);
  });

  it('filters by priority', () => {
    expect(filterTasks(tasks, { query: '', priorities: ['high'] })).toEqual([tasks[0]]);
  });
});

describe('countActiveFilters', () => {
  it('counts the query and each selected priority', () => {
    expect(countActiveFilters({ query: 'bug', priorities: ['high', 'low'] })).toBe(3);
    expect(countActiveFilters({ query: '', priorities: [] })).toBe(0);
  });
});
