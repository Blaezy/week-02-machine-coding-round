import clsx from 'clsx';
import { NavLink, Outlet } from 'react-router';
import { LuColumns3, LuSettings } from 'react-icons/lu';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Board', icon: LuColumns3, end: true },
  { to: '/settings', label: 'Settings', icon: LuSettings },
];

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="size-5 text-accent" />
      <span className="text-sm font-semibold tracking-tight">Lane</span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-sidebar lg:flex">
      <div className="flex h-14 items-center px-4">
        <Brand />
      </div>
      <nav aria-label="Primary" className="flex-1 space-y-0.5 px-2 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-hover text-fg' : 'text-muted hover:bg-hover hover:text-fg',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon aria-hidden="true" className={clsx('size-4', isActive && 'text-accent')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-2">
        <ThemeToggle showLabel />
      </div>
    </aside>
  );
}

function MobileBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-sidebar px-4 lg:hidden">
      <Brand />
      <div className="-mr-2 flex items-center gap-0.5">
        <nav aria-label="Primary" className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                clsx(
                  'flex size-9 items-center justify-center rounded-md transition-colors pointer-coarse:size-11',
                  isActive ? 'bg-hover text-accent' : 'text-muted hover:bg-hover hover:text-fg',
                )
              }
            >
              <Icon aria-hidden="true" className="size-4" />
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function AppShell() {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileBar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
