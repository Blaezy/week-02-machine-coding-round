import { LuSearch, LuX } from 'react-icons/lu';
import { PRIORITIES, STATUSES } from '../../constants/index.js';
import Button from '../ui/Button.jsx';
import { Input, Select } from '../ui/Field.jsx';

export default function BoardToolbar({ filters, onChange, onClear, isFiltering, resultCount, searchRef }) {
  return (
    <div role="search" className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:w-72">
        <LuSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
        />
        <Input
          ref={searchRef}
          type="text"
          inputMode="search"
          aria-label="Search tasks by title"
          placeholder="Search tasks"
          autoComplete="off"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && filters.query) onChange({ query: '' });
          }}
          className="pl-9 pr-9"
        />
        {filters.query ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Clear search"
            onClick={() => {
              onChange({ query: '' });
              searchRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <LuX aria-hidden="true" className="size-4" />
          </Button>
        ) : (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 text-[11px] text-faint md:block"
          >
            /
          </kbd>
        )}
      </div>

      <div className="flex gap-2">
        <Select
          className="flex-1 sm:w-40 sm:flex-none"
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(event) => onChange({ priority: event.target.value })}
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label} priority
            </option>
          ))}
        </Select>

        <Select
          className="flex-1 sm:w-40 sm:flex-none"
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value })}
        >
          <option value="all">All statuses</option>
          {STATUSES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isFiltering && (
        <Button variant="ghost" onClick={onClear} className="self-start sm:self-auto">
          <LuX aria-hidden="true" className="size-4" />
          Clear filters
        </Button>
      )}

      <p role="status" className="sr-only">
        {isFiltering ? `${resultCount} ${resultCount === 1 ? 'task matches' : 'tasks match'} your filters` : ''}
      </p>
    </div>
  );
}
