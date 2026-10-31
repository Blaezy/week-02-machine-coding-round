import clsx from 'clsx';
import { LuChevronDown } from 'react-icons/lu';

export const controlClass =
  'block w-full rounded-md border border-line bg-field px-3 text-base text-fg shadow-card transition-colors placeholder:text-faint hover:border-line-strong focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/25 sm:text-sm';

export function Field({ id, label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-fg">
        {label}
        {hint && <span className="ml-1.5 font-normal text-faint">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }) {
  return <input className={clsx(controlClass, 'h-10 sm:h-9', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={clsx(controlClass, 'min-h-24 resize-y py-2 leading-relaxed', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <div className={clsx('relative', className)}>
      <select className={clsx(controlClass, 'h-10 appearance-none pr-8 sm:h-9')} {...props}>
        {children}
      </select>
      <LuChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-faint"
      />
    </div>
  );
}
