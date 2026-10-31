import { nanoid } from 'nanoid';
import {
  DEFAULT_PREFERENCES,
  LIMITS,
  PRIORITY_IDS,
  STATUS_IDS,
  STORAGE_KEYS,
} from '../constants/index.js';
import { isValidISODate } from '../utils/dates.js';

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function read(key) {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function readJSON(key, fallback) {
  const raw = read(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

export function sanitizeTask(raw) {
  if (!isPlainObject(raw)) return null;
  const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, LIMITS.title) : '';
  if (!title) return null;

  const createdAt =
    typeof raw.createdAt === 'string' && !Number.isNaN(Date.parse(raw.createdAt))
      ? raw.createdAt
      : new Date().toISOString();

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : nanoid(),
    title,
    description:
      typeof raw.description === 'string' ? raw.description.trim().slice(0, LIMITS.description) : '',
    priority: PRIORITY_IDS.includes(raw.priority) ? raw.priority : 'medium',
    status: STATUS_IDS.includes(raw.status) ? raw.status : 'todo',
    dueDate: isValidISODate(raw.dueDate) ? raw.dueDate : '',
    createdAt,
  };
}

export function loadTasks() {
  const stored = readJSON(STORAGE_KEYS.tasks, []);
  if (!Array.isArray(stored)) return [];

  const seen = new Set();
  const tasks = [];
  for (const entry of stored) {
    const task = sanitizeTask(entry);
    if (task && !seen.has(task.id)) {
      seen.add(task.id);
      tasks.push(task);
    }
  }
  return tasks;
}

export const saveTasks = (tasks) => write(STORAGE_KEYS.tasks, JSON.stringify(tasks));

export const loadTheme = () => (read(STORAGE_KEYS.theme) === 'light' ? 'light' : 'dark');

export const saveTheme = (theme) => write(STORAGE_KEYS.theme, theme);

export function loadPreferences() {
  const stored = readJSON(STORAGE_KEYS.preferences, {});
  return {
    ...DEFAULT_PREFERENCES,
    compactCards: isPlainObject(stored) && stored.compactCards === true,
  };
}

export const savePreferences = (preferences) =>
  write(STORAGE_KEYS.preferences, JSON.stringify(preferences));
