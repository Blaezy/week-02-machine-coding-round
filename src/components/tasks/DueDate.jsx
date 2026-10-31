import clsx from 'clsx';
import { LuCalendar } from 'react-icons/lu';
import { formatDueDate, formatLongDate, isOverdue } from '../../utils/dates.js';

export default function DueDate({ task, today }) {
  if (!task.dueDate) return null;
  const overdue = isOverdue(task, today);

  return (
    <time
      dateTime={task.dueDate}
      title={formatLongDate(task.dueDate)}
      className={clsx(
        'inline-flex items-center gap-1 whitespace-nowrap text-xs',
        overdue ? 'font-medium text-danger' : 'text-muted',
      )}
    >
      <LuCalendar aria-hidden="true" className="size-3.5" />
      {overdue && <span>Overdue ·</span>}
      {formatDueDate(task.dueDate, today)}
    </time>
  );
}
