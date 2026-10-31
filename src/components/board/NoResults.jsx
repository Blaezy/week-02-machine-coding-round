import { LuSearchX } from 'react-icons/lu';
import Button from '../ui/Button.jsx';

export default function NoResults({ filters, onClear }) {
  const query = filters.query.trim();
  const searchOnly = Boolean(query) && filters.priority === 'all' && filters.status === 'all';

  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-card text-muted shadow-card">
        <LuSearchX aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold tracking-tight">No matching tasks</h2>
      <p className="mt-1.5 max-w-xs text-sm text-muted">
        {query ? `Nothing matches “${query}” with the current filters.` : 'No tasks match the current filters.'}
      </p>
      <Button className="mt-5" onClick={onClear}>
        {searchOnly ? 'Clear search' : 'Clear filters'}
      </Button>
    </div>
  );
}
