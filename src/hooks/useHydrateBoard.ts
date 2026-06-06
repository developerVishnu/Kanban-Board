import { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';

/**
 * Loads the persisted board snapshot into the store once on mount.
 * Returns whether hydration has finished so the UI can avoid a
 * flash of empty/seed state before the saved board is restored.
 */
export function useHydrateBoard(): boolean {
  const hydrated = useBoardStore((s) => s.hydrated);
  const hydrate = useBoardStore((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  return hydrated;
}
