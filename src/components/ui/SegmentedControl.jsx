import clsx from 'clsx';

export default function SegmentedControl({ name, label, value, onChange, options, className }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={clsx('flex rounded-md border border-line bg-lane p-0.5', className)}
    >
      {options.map((option) => (
        <label key={option.value} className="relative flex-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex h-8 items-center justify-center gap-1.5 rounded px-3 text-[13px] font-medium text-muted transition-colors hover:text-fg peer-checked:bg-card peer-checked:text-fg peer-checked:shadow-card peer-focus-visible:outline-2 peer-focus-visible:outline-accent pointer-coarse:h-10">
            {option.icon}
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
