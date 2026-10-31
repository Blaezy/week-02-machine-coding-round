import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { notify } from '../services/notify.jsx';
import { loadTasks, saveTasks } from '../services/storage.js';
import { createSampleTasks } from '../utils/samples.js';
import { createTask, normalizeValues } from '../utils/tasks.js';
import { tasksReducer } from './taskReducer.js';

export const TasksContext = createContext(null);

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
    if (!saveTasks(tasks)) {
      notify.error("Couldn't save your changes. Browser storage may be full or disabled.", {
        toastId: 'storage-error',
      });
    }
  }, [tasks]);

  const addTask = useCallback((values) => {
    const task = createTask(values);
    dispatch({ type: 'added', task });
    notify.success('Task created');
    return task;
  }, []);

  const updateTask = useCallback((id, values) => {
    dispatch({ type: 'updated', id, changes: normalizeValues(values) });
    notify.success('Task updated');
  }, []);

  const moveTask = useCallback((id, status) => {
    dispatch({ type: 'moved', id, status });
  }, []);

  const removeEntries = useCallback((entries, message, restoredMessage) => {
    if (entries.length === 0) return;
    dispatch({ type: 'removed', ids: entries.map(({ task }) => task.id) });
    notify.undoable(message, () => dispatch({ type: 'restored', entries }), restoredMessage);
  }, []);

  const removeTask = useCallback(
    (id) => {
      const index = tasksRef.current.findIndex((task) => task.id === id);
      if (index === -1) return;
      removeEntries([{ task: tasksRef.current[index], index }], 'Task deleted', 'Task restored');
    },
    [removeEntries],
  );

  const clearCompleted = useCallback(() => {
    const entries = tasksRef.current
      .map((task, index) => ({ task, index }))
      .filter(({ task }) => task.status === 'completed');
    removeEntries(entries, `${plural(entries.length, 'completed task')} cleared`, 'Tasks restored');
  }, [removeEntries]);

  const clearAll = useCallback(() => {
    const entries = tasksRef.current.map((task, index) => ({ task, index }));
    removeEntries(entries, `${plural(entries.length, 'task')} deleted`, 'Tasks restored');
  }, [removeEntries]);

  const addSamples = useCallback(() => {
    dispatch({ type: 'added-many', tasks: createSampleTasks() });
    notify.success('Sample tasks added');
  }, []);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, moveTask, removeTask, clearCompleted, clearAll, addSamples }),
    [tasks, addTask, updateTask, moveTask, removeTask, clearCompleted, clearAll, addSamples],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
