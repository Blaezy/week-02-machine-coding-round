import { LIMITS, PRIORITY_IDS, STATUS_IDS } from '../constants/index.js';
import { isValidISODate, todayISO } from './dates.js';

export const FIELD_ORDER = ['title', 'description', 'priority', 'status', 'dueDate'];

export function validateTask(values, { originalDueDate = '', today = todayISO() } = {}) {
  const errors = {};
  const title = (values.title ?? '').trim();
  const description = (values.description ?? '').trim();

  if (!title) {
    errors.title = 'Give the task a title.';
  } else if (title.length > LIMITS.title) {
    errors.title = `Keep the title under ${LIMITS.title} characters.`;
  }

  if (description.length > LIMITS.description) {
    errors.description = `Keep the description under ${LIMITS.description} characters.`;
  }

  if (!PRIORITY_IDS.includes(values.priority)) {
    errors.priority = 'Choose a priority.';
  }

  if (!STATUS_IDS.includes(values.status)) {
    errors.status = 'Choose a status.';
  }

  if (values.dueDate) {
    if (!isValidISODate(values.dueDate)) {
      errors.dueDate = 'Enter a valid date.';
    } else if (values.dueDate < today && values.dueDate !== originalDueDate) {
      errors.dueDate = "Due date can't be in the past.";
    }
  }

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
