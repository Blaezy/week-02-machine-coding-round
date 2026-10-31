export const STATUSES = [
  {
    id: 'todo',
    label: 'Todo',
    emptyTitle: 'Nothing queued',
    emptyHint: 'New tasks you add will wait here.',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    emptyTitle: 'Nothing in progress',
    emptyHint: 'Drag a task here once you start on it.',
  },
  {
    id: 'completed',
    label: 'Completed',
    emptyTitle: 'Nothing finished yet',
    emptyHint: 'Completed tasks collect here.',
  },
];

export const STATUS_IDS = STATUSES.map((status) => status.id);
export const STATUS_BY_ID = Object.fromEntries(STATUSES.map((status) => [status.id, status]));

export const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

export const PRIORITY_IDS = PRIORITIES.map((priority) => priority.id);
export const PRIORITY_BY_ID = Object.fromEntries(PRIORITIES.map((priority) => [priority.id, priority]));

export const DEFAULT_FILTERS = { query: '', priority: 'all', status: 'all' };

export const DEFAULT_PREFERENCES = { compactCards: false };

export const STORAGE_KEYS = {
  tasks: 'lane.tasks.v1',
  theme: 'lane.theme',
  preferences: 'lane.preferences.v1',
};

export const LIMITS = { title: 120, description: 500 };

export const TAB_PREFIX = 'tab:';
