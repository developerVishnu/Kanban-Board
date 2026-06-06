import type { Priority } from './task';

/**
 * Active filtering / search state applied to the board view.
 * `priorities` empty means "all priorities". `query` is matched
 * against task title and description (case-insensitive).
 */
export interface BoardFilters {
  query: string;
  priorities: Priority[];
}
