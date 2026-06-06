import { useBoardStore } from '../../store/boardStore';
import { PRIORITIES } from '../../constants/priorities';
import { countActiveFilters } from '../../utils/filterTasks';
import { Button } from '../ui';
import styles from './Toolbar.module.scss';

/**
 * Board toolbar: free-text search, priority filter chips, an active
 * filter indicator and the primary "New task" action. Search and
 * priority filters combine (AND) — see {@link filterTasks}.
 */
export function Toolbar() {
  const filters = useBoardStore((s) => s.filters);
  const setQuery = useBoardStore((s) => s.setQuery);
  const togglePriorityFilter = useBoardStore((s) => s.togglePriorityFilter);
  const clearFilters = useBoardStore((s) => s.clearFilters);
  const openCreateModal = useBoardStore((s) => s.openCreateModal);
  const firstColumnId = useBoardStore((s) => s.columns[0]?.id ?? 'todo');

  const activeCount = countActiveFilters(filters);

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <span className={styles.searchIcon} aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by title or description…"
          value={filters.query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className={styles.filters} role="group" aria-label="Filter by priority">
        {PRIORITIES.map((p) => {
          const active = filters.priorities.includes(p.value);
          return (
            <button
              key={p.value}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              style={
                active
                  ? { backgroundColor: p.color, borderColor: p.color }
                  : { borderColor: `${p.color}66`, color: p.color }
              }
              onClick={() => togglePriorityFilter(p.value)}
              aria-pressed={active}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        {activeCount > 0 && (
          <button type="button" className={styles.clear} onClick={clearFilters}>
            <span className={styles.badge}>{activeCount}</span>
            Clear filters
          </button>
        )}
        <Button iconLeft="+" onClick={() => openCreateModal(firstColumnId)}>
          New task
        </Button>
      </div>
    </div>
  );
}
