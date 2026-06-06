import type { Priority } from '../types';

interface PriorityMeta {
  value: Priority;
  label: string;
  /** Accent color; mirrors the SCSS priority tokens. */
  color: string;
  /** Sort weight — higher means more urgent. */
  weight: number;
}

/**
 * Ordered metadata for every priority level. Drives the priority
 * <select>, filter chips, card accents and sorting. Adding a new
 * priority is a one-line change here plus the union in types.
 */
export const PRIORITIES: readonly PriorityMeta[] = [
  { value: 'low', label: 'Low', color: '#10b981', weight: 0 },
  { value: 'medium', label: 'Medium', color: '#3b82f6', weight: 1 },
  { value: 'high', label: 'High', color: '#f59e0b', weight: 2 },
  { value: 'urgent', label: 'Urgent', color: '#ef4444', weight: 3 },
] as const;

/** Lookup map for O(1) access to a priority's metadata. */
export const PRIORITY_MAP: Record<Priority, PriorityMeta> = PRIORITIES.reduce(
  (acc, meta) => {
    acc[meta.value] = meta;
    return acc;
  },
  {} as Record<Priority, PriorityMeta>,
);

export const DEFAULT_PRIORITY: Priority = 'medium';
