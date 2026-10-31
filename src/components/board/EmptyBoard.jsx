import { LuKanban, LuPlus } from 'react-icons/lu';
import Button from '../ui/Button.jsx';

export default function EmptyBoard({ onCreate, onAddSamples }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-card text-accent shadow-card">
        <LuKanban aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold tracking-tight">Your board is empty</h2>
      <p className="mt-1.5 max-w-xs text-sm text-muted">
        Create your first task and move it across Todo, In Progress and Completed as you work.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button variant="primary" onClick={onCreate}>
          <LuPlus aria-hidden="true" className="size-4" />
          Create first task
        </Button>
        <Button variant="ghost" onClick={onAddSamples}>
          Add sample tasks
        </Button>
      </div>
    </div>
  );
}
