import clsx from 'clsx';

export default function Switch({ checked, onChange, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors',
        checked ? 'border-accent bg-accent' : 'border-line-strong bg-lane',
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'size-3.5 rounded-full transition-transform',
          checked ? 'translate-x-[1.1rem] bg-accent-fg' : 'translate-x-0.5 bg-faint',
        )}
      />
    </button>
  );
}
