import type { Column, Task } from '../../types';

/**
 * The full persisted board snapshot. Whatever backend is used,
 * this is the shape that crosses the persistence boundary.
 */
export interface BoardSnapshot {
  columns: Column[];
  tasks: Task[];
}

/**
 * Persistence contract for the board. The store depends only on
 * this interface — never on localStorage directly — so it can be
 * swapped for a REST/GraphQL client later without touching the
 * store or UI. Methods are async to keep that future swap seamless.
 */
export interface BoardStorage {
  load(): Promise<BoardSnapshot | null>;
  save(snapshot: BoardSnapshot): Promise<void>;
  clear(): Promise<void>;
}
