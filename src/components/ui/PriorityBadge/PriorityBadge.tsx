import type { Priority } from '../../../types';
import { PRIORITY_MAP } from '../../../constants/priorities';
import styles from './PriorityBadge.module.scss';

interface PriorityBadgeProps {
  priority: Priority;
}

/** Small colored pill showing a task's priority. */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const meta = PRIORITY_MAP[priority];

  return (
    <span
      className={styles.badge}
      style={{
        // Drive color from the priority token so adding a priority
        // needs no CSS changes.
        color: meta.color,
        backgroundColor: `${meta.color}1f`, // ~12% alpha
        borderColor: `${meta.color}55`,
      }}
    >
      <span className={styles.dot} style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}
