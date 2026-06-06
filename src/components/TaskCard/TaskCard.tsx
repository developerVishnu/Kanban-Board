import { useState, useRef, useLayoutEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { PRIORITY_MAP } from '../../constants/priorities';
import { PriorityBadge } from '../ui';
import { formatRelative } from '../../utils/date';
import { useBoardStore } from '../../store/boardStore';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  /** Rendered inside the DragOverlay (no sortable transforms). */
  isOverlay?: boolean;
}

/** Initials for the assignee avatar. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * A single draggable task card. Color is keyed to priority via a
 * left accent stripe. Clicking (without dragging) opens the edit
 * modal — the parent DndContext uses a movement activation
 * constraint so taps don't trigger a drag.
 */
export function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const openEditModal = useBoardStore((s) => s.openEditModal);

  useLayoutEffect(() => {
    const el = descRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [task.description]);
  const accent = PRIORITY_MAP[task.priority].color;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Expose the accent to CSS for the stripe + tint.
    ['--accent' as string]: accent,
  };

  const classes = [
    styles.card,
    isDragging ? styles.dragging : '',
    isOverlay ? styles.overlay : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={classes}
      {...attributes}
      {...listeners}
      onClick={() => openEditModal(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openEditModal(task.id);
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <div>
          <p
            ref={descRef}
            className={`${styles.description}${expanded ? ` ${styles.descriptionExpanded}` : ''}`}
          >
            {task.description}
          </p>
          {(isClamped || expanded) && (
            <button
              className={styles.readMore}
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.assignee}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(task.assignee) || '?'}
          </span>
          <span className={styles.assigneeName}>{task.assignee}</span>
        </div>
        <time className={styles.date} dateTime={new Date(task.createdAt).toISOString()}>
          {formatRelative(task.createdAt)}
        </time>
      </div>
    </article>
  );
}
