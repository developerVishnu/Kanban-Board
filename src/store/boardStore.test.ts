import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_COLUMNS } from '../constants/columns';
import { useBoardStore } from './boardStore';

beforeEach(() => {
  useBoardStore.setState({
    columns: [...DEFAULT_COLUMNS],
    tasks: [],
    filters: { query: '', priorities: [] },
    hydrated: false,
  });
});

describe('boardStore', () => {
  it('setQuery updates the filter query', () => {
    useBoardStore.getState().setQuery('bug');
    expect(useBoardStore.getState().filters.query).toBe('bug');
  });

  it('togglePriorityFilter adds then removes a priority', () => {
    const { togglePriorityFilter } = useBoardStore.getState();
    togglePriorityFilter('high');
    expect(useBoardStore.getState().filters.priorities).toEqual(['high']);
    togglePriorityFilter('high');
    expect(useBoardStore.getState().filters.priorities).toEqual([]);
  });

  it('clearFilters resets query and priorities', () => {
    const { setQuery, togglePriorityFilter, clearFilters } = useBoardStore.getState();
    setQuery('bug');
    togglePriorityFilter('low');
    clearFilters();
    expect(useBoardStore.getState().filters).toEqual({ query: '', priorities: [] });
  });

  it('addTask adds a task to the column', () => {
    useBoardStore.getState().addTask(
      { title: 'New', description: '', priority: 'medium', assignee: '' },
      'todo',
    );
    const { tasks } = useBoardStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ title: 'New', columnId: 'todo' });
  });
});
