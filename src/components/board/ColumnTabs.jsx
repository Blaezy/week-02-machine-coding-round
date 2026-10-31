import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { TAB_PREFIX } from '../../constants/index.js';

function Tab({ status, count, selected, onSelect }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${TAB_PREFIX}${status.id}` });

  return (
    <button
      ref={setNodeRef}
      type="button"
      role="tab"
      id={`tab-${status.id}`}
      aria-selected={selected}
      aria-controls={`column-${status.id}`}
      onClick={() => onSelect(status.id)}
      className={clsx(
        'flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md text-[13px] font-medium transition-colors',
        selected ? 'bg-card text-fg shadow-card' : 'text-muted',
        isOver && 'bg-accent-soft text-fg ring-1 ring-accent/60',
      )}
    >
      {status.label}
      <span className="text-xs tabular-nums text-faint">{count}</span>
    </button>
  );
}

export default function ColumnTabs({ statuses, counts, activeId, onSelect }) {
  return (
    <div role="tablist" aria-label="Board columns" className="mb-3 flex gap-0.5 rounded-lg border border-line bg-lane p-0.5 md:hidden">
      {statuses.map((status) => (
        <Tab
          key={status.id}
          status={status}
          count={counts[status.id]}
          selected={status.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
