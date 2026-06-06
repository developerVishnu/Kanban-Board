import { useHydrateBoard } from '../../hooks/useHydrateBoard';
import { useBoardStore } from '../../store/boardStore';
import { Toolbar } from '../Toolbar';
import { Board } from '../Board';
import { TaskModal } from '../TaskModal';
import styles from './KanbanApp.module.scss';

/**
 * Top-level composition for the Kanban board: header, toolbar,
 * board surface and the task modal. Handles initial hydration of
 * the persisted board before rendering content.
 */
export function KanbanApp() {
  const hydrated = useHydrateBoard();
  const taskCount = useBoardStore((s) => s.tasks.length);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            ▦
          </span>
          <div>
            <h1 className={styles.heading}>Kanban Board</h1>
            <p className={styles.subheading}>
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'} across the board
            </p>
          </div>
        </div>
      </header>

      <Toolbar />

      <main className={styles.main}>
        {hydrated ? (
          <Board />
        ) : (
          <div className={styles.loading}>Loading board…</div>
        )}
      </main>

      <TaskModal />
    </div>
  );
}
