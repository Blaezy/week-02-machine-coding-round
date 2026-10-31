import { nanoid } from 'nanoid';

export const normalizeValues = (values) => ({
  title: values.title.trim(),
  description: (values.description ?? '').trim(),
  priority: values.priority,
  status: values.status,
  dueDate: values.dueDate || '',
});

export const createTask = (values) => ({
  id: nanoid(),
  ...normalizeValues(values),
  createdAt: new Date().toISOString(),
});

export function hasChanges(task, values) {
  const next = normalizeValues(values);
  return Object.keys(next).some((key) => next[key] !== task[key]);
}

export const toFormValues = (task) => ({
  title: task.title,
  description: task.description,
  priority: task.priority,
  status: task.status,
  dueDate: task.dueDate,
});
