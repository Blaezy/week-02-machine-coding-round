const moveToTop = (tasks, task) => [task, ...tasks.filter((item) => item.id !== task.id)];

export function tasksReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [action.task, ...state];

    case 'added-many': {
      const existing = new Set(state.map((task) => task.id));
      return [...action.tasks.filter((task) => !existing.has(task.id)), ...state];
    }

    case 'updated': {
      const current = state.find((task) => task.id === action.id);
      if (!current) return state;
      const next = { ...current, ...action.changes };
      return next.status !== current.status
        ? moveToTop(state, next)
        : state.map((task) => (task.id === action.id ? next : task));
    }

    case 'moved': {
      const current = state.find((task) => task.id === action.id);
      if (!current || current.status === action.status) return state;
      return moveToTop(state, { ...current, status: action.status });
    }

    case 'removed': {
      const ids = new Set(action.ids);
      return state.filter((task) => !ids.has(task.id));
    }

    case 'restored': {
      const existing = new Set(state.map((task) => task.id));
      const next = [...state];
      [...action.entries]
        .sort((a, b) => a.index - b.index)
        .forEach(({ task, index }) => {
          if (existing.has(task.id)) return;
          next.splice(Math.min(index, next.length), 0, task);
        });
      return next;
    }

    default:
      return state;
  }
}
