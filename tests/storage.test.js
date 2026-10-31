import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadPreferences,
  loadTasks,
  loadTheme,
  sanitizeTask,
  saveTasks,
  saveTheme,
} from '../src/services/storage.js';
import { STORAGE_KEYS } from '../src/constants/index.js';

function installStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => void data.set(key, String(value)),
    removeItem: (key) => void data.delete(key),
  };
  return data;
}

beforeEach(() => installStorage());

test('missing data loads as an empty list', () => {
  assert.deepEqual(loadTasks(), []);
});

test('corrupted JSON loads as an empty list', () => {
  installStorage({ [STORAGE_KEYS.tasks]: '{not json' });
  assert.deepEqual(loadTasks(), []);
});

test('non-array JSON loads as an empty list', () => {
  installStorage({ [STORAGE_KEYS.tasks]: JSON.stringify({ a: 1 }) });
  assert.deepEqual(loadTasks(), []);
});

test('tasks round-trip through save and load', () => {
  const task = {
    id: 'abc',
    title: 'Build Kanban Board',
    description: 'Create a responsive task management interface',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-11-05',
    createdAt: '2026-10-31T00:00:00.000Z',
  };
  assert.equal(saveTasks([task]), true);
  assert.deepEqual(loadTasks(), [task]);
});

test('invalid entries are dropped and bad fields are repaired', () => {
  installStorage({
    [STORAGE_KEYS.tasks]: JSON.stringify([
      null,
      'text',
      { title: '   ' },
      { id: 'x', title: 'Keep me', priority: 'urgent', status: 'blocked', dueDate: '2026-02-31' },
      { id: 'x', title: 'Duplicate id' },
    ]),
  });
  const tasks = loadTasks();
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].title, 'Keep me');
  assert.equal(tasks[0].priority, 'medium');
  assert.equal(tasks[0].status, 'todo');
  assert.equal(tasks[0].dueDate, '');
});

test('sanitizeTask assigns an id when missing', () => {
  const task = sanitizeTask({ title: 'No id' });
  assert.ok(task.id.length > 0);
});

test('storage that throws never crashes reads or writes', () => {
  globalThis.localStorage = {
    getItem() {
      throw new Error('denied');
    },
    setItem() {
      throw new Error('quota');
    },
  };
  assert.deepEqual(loadTasks(), []);
  assert.equal(saveTasks([]), false);
  assert.equal(loadTheme(), 'dark');
  assert.equal(saveTheme('light'), false);
});

test('theme defaults to dark and restores a saved light theme', () => {
  assert.equal(loadTheme(), 'dark');
  saveTheme('light');
  assert.equal(loadTheme(), 'light');
  installStorage({ [STORAGE_KEYS.theme]: 'purple' });
  assert.equal(loadTheme(), 'dark');
});

test('preferences fall back to defaults when corrupted', () => {
  installStorage({ [STORAGE_KEYS.preferences]: '%%%' });
  assert.deepEqual(loadPreferences(), { compactCards: false });
});
