import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../../types';
import { TaskCard } from '../TaskCard';
import { useBoardStore } from '../../store/boardStore';
import styles from './Column.module.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  /** True when at least one filter/search is active (affects empty copy). */
  isFiltering: boolean;
}

/**
 * A board column. Acts as a droppable target (so tasks can be
 * dropped into empty space) and hosts a vertical SortableContext
 * for its cards.
 */
export function Column({ column, tasks, isFiltering }: ColumnProps) {
  const openCreateModal = useBoardStore((s) => s.openCreateModal);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  return (
    <section className={styles.column}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>{column.title}</h2>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <button
          type="button"
          className={styles.add}
          onClick={() => openCreateModal(column.id)}
          aria-label={`Add task to ${column.title}`}
        >
          +
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={`${styles.list} ${isOver ? styles.over : ''}`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className={styles.empty}>
            {isFiltering ? 'No matching tasks' : 'Drop tasks here'}
          </p>
        )}
      </div>
    </section>
  );
}
