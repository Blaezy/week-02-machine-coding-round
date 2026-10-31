import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { LuPlus } from 'react-icons/lu';
import TaskCard from '../tasks/TaskCard.jsx';
import Button from '../ui/Button.jsx';

const dotColor = {
  todo: 'bg-status-todo',
  'in-progress': 'bg-status-progress',
  completed: 'bg-status-done',
};

export default function Column({ status, tasks, isActive, compact, today, onOpenTask, onDeleteTask, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  const headingId = `column-${status.id}-title`;

  return (
    <section
      ref={setNodeRef}
      id={`column-${status.id}`}
      aria-labelledby={headingId}
      className={clsx(
        'min-h-0 flex-col rounded-xl border bg-lane transition-colors',
        isActive ? 'flex' : 'hidden md:flex',
        isOver ? 'border-accent/60 bg-accent-soft' : 'border-line',
      )}
    >
      <header className="flex items-center gap-2 px-3.5 pb-2 pt-3">
        <span aria-hidden="true" className={clsx('size-2 rounded-full', dotColor[status.id])} />
        <h2 id={headingId} className="whitespace-nowrap text-[13px] font-semibold">
          {status.label}
        </h2>
        <span className="rounded-full bg-hover px-1.5 text-xs font-medium tabular-nums text-muted">
          {tasks.length}
          <span className="sr-only"> tasks</span>
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Add task to ${status.label}`}
          onClick={() => onAddTask(status.id)}
          className="ml-auto -mr-1"
        >
          <LuPlus aria-hidden="true" className="size-4" />
        </Button>
      </header>

      {tasks.length > 0 ? (
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2.5 pb-2.5 pt-1">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              today={today}
              compact={compact}
              onOpen={onOpenTask}
              onDelete={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 text-center">
          <p className="text-[13px] font-medium text-muted">{status.emptyTitle}</p>
          <p className="mt-1 max-w-[16rem] text-xs text-faint">{status.emptyHint}</p>
        </div>
      )}
    </section>
  );
}
