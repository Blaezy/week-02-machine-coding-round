import clsx from 'clsx';
import { PRIORITY_BY_ID } from '../../constants/index.js';

const styles = {
  high: { badge: 'bg-high-soft text-high', dot: 'bg-high' },
  medium: { badge: 'bg-medium-soft text-medium', dot: 'bg-medium' },
  low: { badge: 'bg-low-soft text-low', dot: 'bg-low' },
};

export const priorityDot = (priority) => styles[priority].dot;

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] font-medium leading-4',
        styles[priority].badge,
      )}
    >
      <span aria-hidden="true" className={clsx('size-1.5 rounded-full', styles[priority].dot)} />
      {PRIORITY_BY_ID[priority].label}
      <span className="sr-only"> priority</span>
    </span>
  );
}
