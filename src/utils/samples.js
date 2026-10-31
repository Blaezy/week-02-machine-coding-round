import { addDays, todayISO } from './dates.js';
import { createTask } from './tasks.js';

const SAMPLES = [
  { title: 'Submit assignment outline', description: 'Send the outline to the course mentor for review.', priority: 'high', status: 'todo', offset: -1 },
  { title: 'Draft project proposal', description: 'Problem statement, scope and a rough timeline.', priority: 'high', status: 'todo', offset: 3 },
  { title: 'Review colour contrast', description: 'Check text and borders in both themes.', priority: 'medium', status: 'todo', offset: 6 },
  { title: 'Plan weekly study sessions', description: '', priority: 'low', status: 'todo', offset: 0 },
  { title: 'Build the task dialog', description: 'Create and edit flows with validation.', priority: 'high', status: 'in-progress', offset: 1 },
  { title: 'Responsive pass on mobile', description: 'Column tabs, bottom sheet dialog, touch targets.', priority: 'medium', status: 'in-progress', offset: 4 },
  { title: 'Set up Vite and Tailwind', description: 'Project scaffold, tokens and base styles.', priority: 'low', status: 'completed', offset: -2 },
  { title: 'Define the colour palette', description: 'Dark and light themes with a single accent.', priority: 'medium', status: 'completed', offset: -1 },
];

export function createSampleTasks(today = todayISO()) {
  return SAMPLES.map(({ offset, ...values }) =>
    createTask({ ...values, dueDate: addDays(today, offset) }),
  );
}
