import type { TaskDraft } from '../types';

export type TaskFormErrors = Partial<Record<keyof TaskDraft, string>>;

const MAX_TITLE = 80;
const MAX_DESCRIPTION = 500;

/**
 * Validate a task draft. All fields are required; returns a map of
 * field -> error message. An empty map means the draft is valid.
 */
export function validateTask(draft: TaskDraft): TaskFormErrors {
  const errors: TaskFormErrors = {};

  if (!draft.title.trim()) {
    errors.title = 'Title is required.';
  } else if (draft.title.trim().length > MAX_TITLE) {
    errors.title = `Title must be ${MAX_TITLE} characters or fewer.`;
  }

  if (!draft.description.trim()) {
    errors.description = 'Description is required.';
  } else if (draft.description.trim().length > MAX_DESCRIPTION) {
    errors.description = `Description must be ${MAX_DESCRIPTION} characters or fewer.`;
  }

  if (!draft.assignee.trim()) {
    errors.assignee = 'Assignee is required.';
  }

  if (!draft.priority) {
    errors.priority = 'Priority is required.';
  }

  return errors;
}

export function hasErrors(errors: TaskFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
