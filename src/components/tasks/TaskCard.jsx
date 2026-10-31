import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import { LuTrash2 } from 'react-icons/lu';
import { wasJustDragged } from '../../utils/dragGuard.js';
import Button from '../ui/Button.jsx';
import DueDate from './DueDate.jsx';
import PriorityBadge from './PriorityBadge.jsx';

export function TaskCardView({ task, today, compact, isOverlay = false, onOpen, onDelete }) {
  const completed = task.status === 'completed';

  return (
    <article
      className={clsx(
        'group relative rounded-lg border border-line bg-card p-3 shadow-card transition-colors',
        isOverlay ? 'rotate-1 cursor-grabbing border-line-strong shadow-pop' : 'cursor-grab hover:bg-card-hover',
      )}
    >
      <h3 className="pr-7 text-sm font-medium leading-snug">
        <button
          type="button"
          onClick={() => {
            if (!wasJustDragged()) onOpen?.(task);
          }}
          className={clsx(
            'cursor-pointer text-left after:absolute after:inset-0 after:rounded-lg after:content-[""] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent',
            completed && 'text-muted line-through decoration-faint',
          )}
        >
          {task.title}
        </button>
      </h3>

      {task.description && !compact && (
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{task.description}</p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <PriorityBadge priority={task.priority} />
        <DueDate task={task} today={today} />
      </div>

      {!isOverlay && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete task: ${task.title}`}
          onClick={() => onDelete(task.id)}
          className="absolute right-1.5 top-1.5 z-10 opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <LuTrash2 aria-hidden="true" className="size-4" />
        </Button>
      )}
    </article>
  );
}

function DraggableTaskCard({ task, today, compact, onOpen, onDelete }) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: task.id });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      style={{ touchAction: 'manipulation' }}
      className={clsx('list-none', isDragging && 'opacity-40')}
    >
      <TaskCardView task={task} today={today} compact={compact} onOpen={onOpen} onDelete={onDelete} />
    </li>
  );
}

export default memo(DraggableTaskCard);
