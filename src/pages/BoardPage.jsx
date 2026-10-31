import { useCallback, useEffect, useRef, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import Board from '../components/board/Board.jsx';
import BoardToolbar from '../components/board/BoardToolbar.jsx';
import EmptyBoard from '../components/board/EmptyBoard.jsx';
import NoResults from '../components/board/NoResults.jsx';
import TaskDialog from '../components/tasks/TaskDialog.jsx';
import Button from '../components/ui/Button.jsx';
import { STATUS_IDS } from '../constants/index.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useTaskFilters } from '../hooks/useTaskFilters.js';
import { useTasks } from '../hooks/useTasks.js';

const isTypingTarget = (target) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export default function BoardPage() {
  useDocumentTitle('Board');
  const { tasks, addSamples } = useTasks();
  const { filters, setFilter, clearFilters, filteredTasks, isFiltering } = useTaskFilters(tasks);
  const [editor, setEditor] = useState(null);
  const searchRef = useRef(null);

  const openCreate = useCallback((status = 'todo') => setEditor({ task: null, status }), []);
  const openEdit = useCallback((task) => setEditor({ task, status: task.status }), []);
  const closeEditor = useCallback(() => setEditor(null), []);

  useEffect(() => {
    function onKeyDown(event) {
      if (editor || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (event.key === 'n') {
        event.preventDefault();
        openCreate();
      } else if (event.key === '/') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [editor, openCreate]);

  const hasTasks = tasks.length > 0;
  const statusIds = filters.status === 'all' ? STATUS_IDS : [filters.status];

  let content;
  if (!hasTasks) {
    content = <EmptyBoard onCreate={() => openCreate()} onAddSamples={addSamples} />;
  } else if (filteredTasks.length === 0) {
    content = <NoResults filters={filters} onClear={clearFilters} />;
  } else {
    content = <Board tasks={filteredTasks} statusIds={statusIds} onOpenTask={openEdit} onAddTask={openCreate} />;
  }

  return (
    <div className="flex h-full min-h-[34rem] flex-col px-4 pb-4 pt-5 md:px-6 md:pb-6 md:pt-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Board</h1>
          <p className="mt-0.5 text-sm text-muted">Plan, track and finish your work.</p>
        </div>
        <Button variant="primary" onClick={() => openCreate()} aria-keyshortcuts="N">
          <LuPlus aria-hidden="true" className="size-4" />
          New task
        </Button>
      </div>

      {hasTasks && (
        <div className="mb-4">
          <BoardToolbar
            filters={filters}
            onChange={setFilter}
            onClear={clearFilters}
            isFiltering={isFiltering}
            resultCount={filteredTasks.length}
            searchRef={searchRef}
          />
        </div>
      )}

      {content}

      {editor && <TaskDialog task={editor.task} defaultStatus={editor.status} onClose={closeEditor} />}
    </div>
  );
}
