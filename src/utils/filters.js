import { DEFAULT_FILTERS, STATUS_IDS } from '../constants/index.js';

export function filterTasks(tasks, { query, priority, status }) {
  const needle = query.trim().toLowerCase();
  return tasks.filter(
    (task) =>
      (!needle || task.title.toLowerCase().includes(needle)) &&
      (priority === 'all' || task.priority === priority) &&
      (status === 'all' || task.status === status),
  );
}

export function groupByStatus(tasks) {
  const groups = Object.fromEntries(STATUS_IDS.map((id) => [id, []]));
  for (const task of tasks) groups[task.status]?.push(task);
  return groups;
}

export const hasActiveFilters = (filters) =>
  filters.query.trim() !== DEFAULT_FILTERS.query ||
  filters.priority !== DEFAULT_FILTERS.priority ||
  filters.status !== DEFAULT_FILTERS.status;
