# Lane — Kanban task board

A focused Kanban board built with React, Vite and Tailwind CSS. Tasks move through **Todo → In Progress → Completed**, are searchable and filterable, and persist in the browser. Dark theme by default, with a full light theme.

## Run it

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
npm test           # logic tests (reducer, storage, validation, filters, dates)
```

## Features

- **Tasks** — create, edit, delete with Undo, and move between columns. Title is required; description, priority, due date and status are set from one dialog.
- **Drag and drop** — `@dnd-kit/core`, mouse and touch (touch uses a short press-and-hold so scrolling still works). On mobile you can drop a card onto a column tab. The Edit dialog's status selector is the accessible alternative.
- **Search and filters** — live, case-insensitive title search plus priority and status filters. They combine, and never touch the stored tasks. Filtering by status shows just that column.
- **Persistence** — one `localStorage` service (`src/services/storage.js`). Corrupt or missing data is repaired or discarded instead of crashing; failed writes show a toast.
- **Themes** — dark by default, light available, remembered across visits, applied before first paint so there is no flash.
- **Settings** — theme, compact cards, and data actions (add samples, clear completed, delete all — each undoable).
- **States** — empty board, empty column, no results, inline validation, overdue indicator.
- **Responsive** — sidebar on large screens, compact top bar below 1024px, and a column-tab layout on phones with a bottom-sheet dialog.
- **Keyboard** — `n` new task, `/` focus search, `Esc` clears search or closes a dialog. Everything is reachable by Tab.

## Design notes

- One accent colour (teal). Status and priority use small, muted colour cues rather than coloured panels.
- All colours are tokens in `src/styles/index.css` (`bg-card`, `text-muted`, `border-line` …) defined separately for each theme; components never use raw colours. The two themes are tuned independently, not inverted.
- Inter (self-hosted through `@fontsource-variable/inter`, no CDN).
- Within a column, the most recently created or moved task sits on top.

## Structure

```
src/
  components/
    layout/   AppShell, Logo, ThemeToggle
    board/    Board, Column, ColumnTabs, BoardToolbar, EmptyBoard, NoResults
    tasks/    TaskCard, TaskDialog, TaskForm, PriorityBadge, DueDate
    ui/       Button, Dialog, Field, SegmentedControl, Switch, UndoToast
  context/    TasksContext (+ pure reducer), SettingsContext
  hooks/      useTasks, useSettings, useTaskFilters, useDocumentTitle
  services/   storage (all localStorage access), notify (toasts)
  utils/      dates, validation, filters, tasks, samples, dragGuard
  constants/  statuses, priorities, storage keys, limits
  pages/      BoardPage, SettingsPage
tests/        node:test suites for the non-UI logic
```

State is a `useReducer` behind a context; business logic (reducer, validation, filtering, date helpers) is plain JavaScript with no React, which is why it is unit tested directly. Dependencies are limited to what is used: React, React Router, `@dnd-kit/core`, React Toastify, React Icons, `clsx`, `nanoid` and the Inter font.

## Deploying

The app uses client-side routing (`/settings`). `public/_redirects` handles this on Netlify; on other static hosts, configure a fallback to `index.html`.

## Task shape

```js
{
  id: 'nanoid',
  title: 'Build Kanban Board',
  description: 'Create a responsive task management interface',
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'in-progress' | 'completed',
  dueDate: '2026-11-05',   // '' when not set
  createdAt: 'ISO date',
}
```
