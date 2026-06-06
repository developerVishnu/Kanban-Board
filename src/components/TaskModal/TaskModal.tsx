import { useMemo, useState } from 'react';
import { Modal, Button } from '../ui';
import { TaskForm } from './TaskForm';
import { useBoardStore } from '../../store/boardStore';
import { DEFAULT_PRIORITY } from '../../constants/priorities';
import type { TaskDraft } from '../../types';
import styles from './TaskModal.module.scss';

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  priority: DEFAULT_PRIORITY,
  assignee: '',
};

/**
 * Create / edit / delete modal shell. Sources its open state and
 * target task from the store and owns the delete-confirm flow; the
 * form itself lives in {@link TaskForm}, remounted per target.
 */
export function TaskModal() {
  const isOpen = useBoardStore((s) => s.isModalOpen);
  const editingTaskId = useBoardStore((s) => s.editingTaskId);
  const draftColumnId = useBoardStore((s) => s.draftColumnId);
  const tasks = useBoardStore((s) => s.tasks);
  const addTask = useBoardStore((s) => s.addTask);
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const closeModal = useBoardStore((s) => s.closeModal);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingTaskId) ?? null,
    [tasks, editingTaskId],
  );
  const isEditing = Boolean(editingTask);

  if (!isOpen) return null;

  const initialDraft: TaskDraft = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        assignee: editingTask.assignee,
      }
    : EMPTY_DRAFT;

  // Reset transient confirm state on every close path (the modal
  // instance stays mounted between opens).
  const handleClose = () => {
    setConfirmingDelete(false);
    closeModal();
  };

  const handleSubmit = (draft: TaskDraft) => {
    if (editingTask) {
      updateTask(editingTask.id, draft);
    } else {
      addTask(draft, draftColumnId ?? 'todo');
    }
    handleClose();
  };

  const handleDelete = () => {
    if (editingTask) deleteTask(editingTask.id);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create Task'}
      footer={
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {isEditing &&
              (confirmingDelete ? (
                <div className={styles.confirm}>
                  <span>Delete?</span>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                  >
                    Yes, delete
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete
                </Button>
              ))}
          </div>
          <div className={styles.footerRight}>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" form="task-form">
              {isEditing ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </div>
      }
    >
      {/* `key` remounts the form to load the target task's values. */}
      <TaskForm
        key={editingTaskId ?? 'new'}
        initialDraft={initialDraft}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
