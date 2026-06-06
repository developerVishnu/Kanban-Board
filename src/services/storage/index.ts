import { LocalStorageBoardStorage } from './localStorageBoardStorage';
import type { BoardStorage } from './types';

export type { BoardStorage, BoardSnapshot } from './types';
export { LocalStorageBoardStorage } from './localStorageBoardStorage';

/**
 * The active storage backend for the app. Swap this single line to
 * migrate the whole app to an API-backed store, e.g.
 *   export const boardStorage = new ApiBoardStorage('/api/board');
 */
export const boardStorage: BoardStorage = new LocalStorageBoardStorage();
