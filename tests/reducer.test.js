import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tasksReducer } from '../src/context/taskReducer.js';
import { createTask } from '../src/utils/tasks.js';

const make = (title, status = 'todo') =>
  createTask({ title, description: '', priority: 'medium', status, dueDate: '' });

test('added puts the new task first', () => {
  const a = make('A');
  const b = make('B');
  const state = tasksReducer(tasksReducer([], { type: 'added', task: a }), { type: 'added', task: b });
  assert.deepEqual(state.map((t) => t.title), ['B', 'A']);
});

test('updated changes fields in place when status is unchanged', () => {
  const a = make('A');
  const b = make('B');
  const state = tasksReducer([a, b], { type: 'updated', id: a.id, changes: { title: 'A2', priority: 'high' } });
  assert.deepEqual(state.map((t) => t.title), ['A2', 'B']);
  assert.equal(state[0].priority, 'high');
  assert.equal(state[0].id, a.id);
  assert.equal(state[0].createdAt, a.createdAt);
});

test('updated moves a task to the top of its new column when status changes', () => {
  const a = make('A');
  const b = make('B');
  const c = make('C', 'in-progress');
  const state = tasksReducer([a, b, c], { type: 'updated', id: b.id, changes: { status: 'in-progress' } });
  assert.deepEqual(state.map((t) => t.title), ['B', 'A', 'C']);
  assert.equal(state[0].status, 'in-progress');
});

test('moved changes status and ignores same-status moves', () => {
  const a = make('A');
  const state = [a];
  assert.equal(tasksReducer(state, { type: 'moved', id: a.id, status: 'todo' }), state);
  const moved = tasksReducer(state, { type: 'moved', id: a.id, status: 'completed' });
  assert.equal(moved[0].status, 'completed');
});

test('unknown ids leave state untouched', () => {
  const state = [make('A')];
  assert.equal(tasksReducer(state, { type: 'moved', id: 'nope', status: 'completed' }), state);
  assert.equal(tasksReducer(state, { type: 'updated', id: 'nope', changes: {} }), state);
});

test('removed then restored puts tasks back at their original positions', () => {
  const tasks = ['A', 'B', 'C', 'D'].map((title) => make(title));
  const entries = [1, 3].map((index) => ({ task: tasks[index], index }));
  const removed = tasksReducer(tasks, { type: 'removed', ids: entries.map((e) => e.task.id) });
  assert.deepEqual(removed.map((t) => t.title), ['A', 'C']);
  const restored = tasksReducer(removed, { type: 'restored', entries });
  assert.deepEqual(restored.map((t) => t.title), ['A', 'B', 'C', 'D']);
});

test('restored does not duplicate a task that already exists', () => {
  const a = make('A');
  const state = tasksReducer([a], { type: 'restored', entries: [{ task: a, index: 0 }] });
  assert.equal(state.length, 1);
});

test('added-many skips ids that already exist', () => {
  const a = make('A');
  const b = make('B');
  const state = tasksReducer([a], { type: 'added-many', tasks: [a, b] });
  assert.deepEqual(state.map((t) => t.title), ['B', 'A']);
});
