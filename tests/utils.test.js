import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, diffInDays, formatDueDate, isOverdue, isValidISODate } from '../src/utils/dates.js';
import { filterTasks, groupByStatus, hasActiveFilters } from '../src/utils/filters.js';
import { hasErrors, validateTask } from '../src/utils/validation.js';
import { createSampleTasks } from '../src/utils/samples.js';

const TODAY = '2026-10-31';

const valid = { title: 'Write tests', description: '', priority: 'medium', status: 'todo', dueDate: '' };

test('isValidISODate rejects impossible dates', () => {
  assert.equal(isValidISODate('2026-02-28'), true);
  assert.equal(isValidISODate('2026-02-31'), false);
  assert.equal(isValidISODate('26-02-01'), false);
  assert.equal(isValidISODate(''), false);
  assert.equal(isValidISODate(null), false);
});

test('date arithmetic crosses month and year boundaries', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(addDays('2026-01-01', -1), '2025-12-31');
  assert.equal(diffInDays('2026-11-05', '2026-10-31'), 5);
});

test('formatDueDate uses relative labels near today and short dates otherwise', () => {
  assert.equal(formatDueDate('2026-10-31', TODAY), 'Today');
  assert.equal(formatDueDate('2026-11-01', TODAY), 'Tomorrow');
  assert.equal(formatDueDate('2026-10-30', TODAY), 'Yesterday');
  assert.equal(formatDueDate('2026-11-05', TODAY), 'Nov 5');
  assert.equal(formatDueDate('2027-01-05', TODAY), 'Jan 5, 2027');
});

test('isOverdue ignores completed tasks and tasks without dates', () => {
  assert.equal(isOverdue({ dueDate: '2026-10-30', status: 'todo' }, TODAY), true);
  assert.equal(isOverdue({ dueDate: '2026-10-30', status: 'completed' }, TODAY), false);
  assert.equal(isOverdue({ dueDate: '2026-10-31', status: 'todo' }, TODAY), false);
  assert.equal(isOverdue({ dueDate: '', status: 'todo' }, TODAY), false);
});

test('validation requires a title', () => {
  assert.equal(validateTask({ ...valid, title: '   ' }, { today: TODAY }).title, 'Give the task a title.');
  assert.equal(hasErrors(validateTask(valid, { today: TODAY })), false);
});

test('validation enforces length limits', () => {
  assert.ok(validateTask({ ...valid, title: 'x'.repeat(121) }, { today: TODAY }).title);
  assert.ok(validateTask({ ...valid, description: 'x'.repeat(501) }, { today: TODAY }).description);
});

test('validation rejects past and malformed due dates but keeps an unchanged one', () => {
  assert.ok(validateTask({ ...valid, dueDate: '2026-10-30' }, { today: TODAY }).dueDate);
  assert.ok(validateTask({ ...valid, dueDate: '2026-13-01' }, { today: TODAY }).dueDate);
  assert.equal(validateTask({ ...valid, dueDate: '2026-10-31' }, { today: TODAY }).dueDate, undefined);
  assert.equal(
    validateTask({ ...valid, dueDate: '2026-10-01' }, { today: TODAY, originalDueDate: '2026-10-01' }).dueDate,
    undefined,
  );
});

test('validation rejects unknown priority and status', () => {
  const errors = validateTask({ ...valid, priority: 'urgent', status: 'blocked' }, { today: TODAY });
  assert.ok(errors.priority);
  assert.ok(errors.status);
});

const tasks = [
  { id: '1', title: 'Build Kanban Board', priority: 'high', status: 'todo' },
  { id: '2', title: 'build tests', priority: 'low', status: 'todo' },
  { id: '3', title: 'Design tokens', priority: 'high', status: 'completed' },
  { id: '4', title: 'Deploy', priority: 'medium', status: 'in-progress' },
];
const open = { query: '', priority: 'all', status: 'all' };

test('search is case-insensitive and matches titles only', () => {
  assert.deepEqual(filterTasks(tasks, { ...open, query: 'BUILD' }).map((t) => t.id), ['1', '2']);
  assert.deepEqual(filterTasks(tasks, { ...open, query: '  deploy ' }).map((t) => t.id), ['4']);
});

test('search, priority and status combine', () => {
  const result = filterTasks(tasks, { query: 'build', priority: 'high', status: 'todo' });
  assert.deepEqual(result.map((t) => t.id), ['1']);
  assert.deepEqual(filterTasks(tasks, { ...open, priority: 'high' }).map((t) => t.id), ['1', '3']);
  assert.deepEqual(filterTasks(tasks, { ...open, status: 'completed' }).map((t) => t.id), ['3']);
});

test('filtering never mutates the source list', () => {
  const snapshot = JSON.stringify(tasks);
  filterTasks(tasks, { query: 'zzz', priority: 'low', status: 'completed' });
  assert.equal(JSON.stringify(tasks), snapshot);
});

test('groupByStatus always returns every column', () => {
  const groups = groupByStatus([]);
  assert.deepEqual(Object.keys(groups), ['todo', 'in-progress', 'completed']);
  assert.equal(groupByStatus(tasks).todo.length, 2);
});

test('hasActiveFilters ignores whitespace-only queries', () => {
  assert.equal(hasActiveFilters(open), false);
  assert.equal(hasActiveFilters({ ...open, query: '   ' }), false);
  assert.equal(hasActiveFilters({ ...open, status: 'todo' }), true);
});

test('sample tasks cover every column and include an overdue task', () => {
  const samples = createSampleTasks(TODAY);
  assert.equal(new Set(samples.map((t) => t.status)).size, 3);
  assert.ok(samples.some((t) => isOverdue(t, TODAY)));
  assert.equal(new Set(samples.map((t) => t.id)).size, samples.length);
});
