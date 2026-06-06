/**
 * Format an epoch-ms timestamp as a short, human-friendly label
 * e.g. "Jun 6, 2026". Used on task cards.
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp);
}

/**
 * Format an epoch-ms timestamp as a relative label e.g. "2h ago",
 * falling back to an absolute date for anything older than a week.
 */
export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return formatDate(timestamp);
}
