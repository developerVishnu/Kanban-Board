import type { BoardSnapshot, BoardStorage } from './types';

const STORAGE_KEY = 'kanban-board:v1';

/**
 * localStorage-backed implementation of {@link BoardStorage}.
 *
 * Although localStorage is synchronous, the methods are async to
 * honour the interface — a future `ApiBoardStorage` (fetch-based)
 * can drop in with no changes to the store. All access is guarded
 * so a corrupt payload or unavailable storage degrades gracefully
 * instead of throwing.
 */
export class LocalStorageBoardStorage implements BoardStorage {
  private readonly key: string;

  constructor(key: string = STORAGE_KEY) {
    this.key = key;
  }

  async load(): Promise<BoardSnapshot | null> {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as BoardSnapshot;
      if (!parsed || !Array.isArray(parsed.columns) || !Array.isArray(parsed.tasks)) {
        return null;
      }
      return parsed;
    } catch (err) {
      console.warn('[storage] Failed to load board snapshot', err);
      return null;
    }
  }

  async save(snapshot: BoardSnapshot): Promise<void> {
    try {
      localStorage.setItem(this.key, JSON.stringify(snapshot));
    } catch (err) {
      console.warn('[storage] Failed to save board snapshot', err);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.key);
    } catch (err) {
      console.warn('[storage] Failed to clear board snapshot', err);
    }
  }
}
