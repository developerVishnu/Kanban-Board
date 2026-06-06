import { useState, type FormEvent } from 'react';
import { TextField, TextArea, Select } from '../ui';
import type { SelectOption } from '../ui';
import { PRIORITIES } from '../../constants/priorities';
import {
  validateTask,
  hasErrors,
  type TaskFormErrors,
} from '../../utils/validateTask';
import type { Priority, TaskDraft } from '../../types';
import styles from './TaskModal.module.scss';

interface TaskFormProps {
  /** Initial values; the parent remounts this form (via `key`) to reset. */
  initialDraft: TaskDraft;
  onSubmit: (draft: TaskDraft) => void;
}

const PRIORITY_OPTIONS: SelectOption[] = PRIORITIES.map((p) => ({
  value: p.value,
  label: p.label,
}));

/**
 * Controlled task form with per-field validation. Initial state is
 * seeded from props once; the parent remounts the component with a
 * `key` to load a different task, so no syncing effect is needed.
 */
export function TaskForm({ initialDraft, onSubmit }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const update = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateTask(draft);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      title: draft.title.trim(),
      description: draft.description.trim(),
      assignee: draft.assignee.trim(),
      priority: draft.priority,
    });
  };

  return (
    <form id="task-form" className={styles.form} onSubmit={handleSubmit} noValidate>
      <TextField
        id="task-title"
        label="Title"
        placeholder="e.g. Design login screen"
        required
        value={draft.title}
        error={errors.title}
        onChange={(e) => update('title', e.target.value)}
        autoFocus
      />

      <TextArea
        id="task-description"
        label="Description"
        placeholder="Add more detail about this task…"
        required
        value={draft.description}
        error={errors.description}
        onChange={(e) => update('description', e.target.value)}
      />

      <div className={styles.row}>
        <Select
          id="task-priority"
          label="Priority"
          required
          options={PRIORITY_OPTIONS}
          value={draft.priority}
          error={errors.priority}
          onChange={(e) => update('priority', e.target.value as Priority)}
        />

        <TextField
          id="task-assignee"
          label="Assignee"
          placeholder="e.g. Alex Kim"
          required
          value={draft.assignee}
          error={errors.assignee}
          onChange={(e) => update('assignee', e.target.value)}
        />
      </div>
    </form>
  );
}
