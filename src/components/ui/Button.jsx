import clsx from 'clsx';

const base =
  'inline-flex shrink-0 select-none items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
  secondary: 'border border-line bg-card text-fg shadow-card hover:border-line-strong hover:bg-card-hover',
  ghost: 'text-muted hover:bg-hover hover:text-fg',
  danger: 'text-danger hover:bg-danger-soft',
};

const sizes = {
  md: 'h-9 px-3.5 pointer-coarse:h-11',
  sm: 'h-8 px-2.5 pointer-coarse:h-10',
  icon: 'size-8 pointer-coarse:size-10',
  'icon-sm': 'size-7 pointer-coarse:size-9',
};

export default function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...props }) {
  return <button type={type} className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
