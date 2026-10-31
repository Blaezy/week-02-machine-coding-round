import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import clsx from 'clsx';
import { STATUSES, STATUS_BY_ID, TAB_PREFIX } from '../../constants/index.js';
import { useSettings } from '../../hooks/useSettings.js';
import { useTasks } from '../../hooks/useTasks.js';
import { todayISO } from '../../utils/dates.js';
import { markDragEnd } from '../../utils/dragGuard.js';
import { groupByStatus } from '../../utils/filters.js';
import { TaskCardView } from '../tasks/TaskCard.jsx';
import Column from './Column.jsx';
import ColumnTabs from './ColumnTabs.jsx';

const collisionDetection = (args) => {
  const within = pointerWithin(args);
  return within.length > 0 ? within : rectIntersection(args);
};

const toStatusId = (droppableId) => String(droppableId).replace(TAB_PREFIX, '');

export default function Board({ tasks, statusIds, onOpenTask, onAddTask }) {
  const { moveTask, removeTask } = useTasks();
  const { compactCards } = useSettings();
  const [tab, setTab] = useState('todo');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
  );

  const columns = STATUSES.filter((status) => statusIds.includes(status.id));
  const groups = useMemo(() => groupByStatus(tasks), [tasks]);
  const counts = useMemo(
    () => Object.fromEntries(Object.entries(groups).map(([id, list]) => [id, list.length])),
    [groups],
  );
  const activeTab = statusIds.includes(tab) ? tab : statusIds[0];
  const today = todayISO();

  const titleOf = (id) => tasks.find((task) => task.id === id)?.title ?? 'task';
  const labelOf = (id) => STATUS_BY_ID[toStatusId(id)]?.label ?? 'a column';

  const accessibility = {
    screenReaderInstructions: {
      draggable: 'Open a task to change its status from the editor.',
    },
    announcements: {
      onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
      onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} is over ${labelOf(over.id)}.` : undefined),
      onDragEnd: ({ active, over }) =>
        over ? `Moved ${titleOf(active.id)} to ${labelOf(over.id)}.` : `Dropped ${titleOf(active.id)}.`,
      onDragCancel: ({ active }) => `Cancelled moving ${titleOf(active.id)}.`,
    },
  };

  function handleDragEnd({ active, over }) {
    markDragEnd();
    setActiveTask(null);
    if (over) moveTask(active.id, toStatusId(over.id));
  }

  function handleDragCancel() {
    markDragEnd();
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={accessibility}
      onDragStart={({ active }) => setActiveTask(tasks.find((task) => task.id === active.id) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <ColumnTabs statuses={columns} counts={counts} activeId={activeTab} onSelect={setTab} />
        <div
          style={{ '--cols': columns.length }}
          className={clsx(
            'grid min-h-0 flex-1 grid-cols-1 gap-3 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] md:gap-4',
            columns.length === 1 && 'md:max-w-md',
          )}
        >
          {columns.map((status) => (
            <Column
              key={status.id}
              status={status}
              tasks={groups[status.id]}
              isActive={status.id === activeTab}
              compact={compactCards}
              today={today}
              onOpenTask={onOpenTask}
              onDeleteTask={removeTask}
              onAddTask={onAddTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask && <TaskCardView task={activeTask} today={today} compact={compactCards} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
