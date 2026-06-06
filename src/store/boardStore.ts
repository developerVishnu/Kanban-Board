import { create } from 'zustand';
import type { BoardFilters, Column, Task, TaskDraft } from '../types';
import { DEFAULT_COLUMNS } from '../constants/columns';
import { SEED_TASKS } from '../constants/seed';
import { boardStorage } from '../services/storage';
import { createId } from '../utils/id';
import { moveTaskInList } from './arrangement';

interface BoardState {
  // ---- Persisted domain state ----
  columns: Column[];
  tasks: Task[];

  // ---- Transient UI state (not persisted) ----
  filters: BoardFilters;
  /** Whether the task create/edit modal is open. */
  isModalOpen: boolean;
  /** Task being edited, or null when creating a new task. */
  editingTaskId: string | null;
  /** Column a freshly created task should land in. */
  draftColumnId: string | null;
  /** True once the persisted snapshot has been loaded. */
  hydrated: boolean;

  // ---- Task actions ----
  addTask: (draft: TaskDraft, columnId: string) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, toColumnId: string, toIndex: number) => void;

  // ---- Column actions (extensibility) ----
  addColumn: (title: string) => void;

  // ---- Filter / search actions ----
  setQuery: (query: string) => void;
  togglePriorityFilter: (priority: BoardFilters['priorities'][number]) => void;
  clearFilters: () => void;

  // ---- Modal actions ----
  openCreateModal: (columnId: string) => void;
  openEditModal: (taskId: string) => void;
  closeModal: () => void;

  // ---- Lifecycle ----
  hydrate: () => Promise<void>;
}

const EMPTY_FILTERS: BoardFilters = { query: '', priorities: [] };

export const useBoardStore = create<BoardState>((set) => ({
  columns: [...DEFAULT_COLUMNS],
  tasks: [],
  filters: EMPTY_FILTERS,
  isModalOpen: false,
  editingTaskId: null,
  draftColumnId: null,
  hydrated: false,

  addTask: (draft, columnId) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...draft,
          id: createId(),
          columnId,
          createdAt: Date.now(),
        },
      ],
    })),

  updateTask: (id, draft) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...draft } : task,
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  moveTask: (taskId, toColumnId, toIndex) =>
    set((state) => ({
      tasks: moveTaskInList(
        state.tasks,
        state.columns,
        taskId,
        toColumnId,
        toIndex,
      ),
    })),

  addColumn: (title) =>
    set((state) => ({
      columns: [...state.columns, { id: createId(), title: title.trim() }],
    })),

  setQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, query } })),

  togglePriorityFilter: (priority) =>
    set((state) => {
      const active = state.filters.priorities.includes(priority);
      return {
        filters: {
          ...state.filters,
          priorities: active
            ? state.filters.priorities.filter((p) => p !== priority)
            : [...state.filters.priorities, priority],
        },
      };
    }),

  clearFilters: () => set({ filters: EMPTY_FILTERS }),

  openCreateModal: (columnId) =>
    set({ isModalOpen: true, editingTaskId: null, draftColumnId: columnId }),

  openEditModal: (taskId) =>
    set({ isModalOpen: true, editingTaskId: taskId, draftColumnId: null }),

  closeModal: () =>
    set({ isModalOpen: false, editingTaskId: null, draftColumnId: null }),

  hydrate: async () => {
    const snapshot = await boardStorage.load();
    if (snapshot) {
      set({
        columns: snapshot.columns.length
          ? snapshot.columns
          : [...DEFAULT_COLUMNS],
        tasks: snapshot.tasks,
        hydrated: true,
      });
    } else {
      // First ever load — seed with example tasks, then mark
      // hydrated so the snapshot gets persisted by the subscriber.
      set({ tasks: SEED_TASKS, hydrated: true });
    }
  },
}));

// ---------------------------------------------------------------
// Persistence wiring: mirror domain state to the storage backend
// on every change, once hydration has completed. The store never
// references localStorage directly — only the BoardStorage port —
// so swapping in an API backend needs no changes here.
// ---------------------------------------------------------------
let saveTimer: ReturnType<typeof setTimeout> | undefined;

useBoardStore.subscribe((state, prev) => {
  if (!state.hydrated) return;
  const changed =
    state.tasks !== prev.tasks || state.columns !== prev.columns;
  if (!changed) return;

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void boardStorage.save({ columns: state.columns, tasks: state.tasks });
  }, 150);
});
