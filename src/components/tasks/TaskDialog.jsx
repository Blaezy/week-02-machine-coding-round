import { useId } from 'react';
import { LuX } from 'react-icons/lu';
import { useTasks } from '../../hooks/useTasks.js';
import { hasChanges, toFormValues } from '../../utils/tasks.js';
import Button from '../ui/Button.jsx';
import Dialog from '../ui/Dialog.jsx';
import TaskForm from './TaskForm.jsx';

const blankValues = (status) => ({
  title: '',
  description: '',
  priority: 'medium',
  status,
  dueDate: '',
});

export default function TaskDialog({ task, defaultStatus = 'todo', onClose }) {
  const { addTask, updateTask, removeTask } = useTasks();
  const titleId = useId();
  const isEdit = Boolean(task);

  function handleSubmit(values) {
    if (!isEdit) addTask(values);
    else if (hasChanges(task, values)) updateTask(task.id, values);
    onClose();
  }

  function handleDelete() {
    removeTask(task.id);
    onClose();
  }

  return (
    <Dialog labelledBy={titleId} onClose={onClose}>
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 id={titleId} className="text-[15px] font-semibold tracking-tight">
          {isEdit ? 'Edit task' : 'New task'}
        </h2>
        <Button variant="ghost" size="icon" aria-label="Close dialog" onClick={onClose} className="-mr-2">
          <LuX aria-hidden="true" className="size-4" />
        </Button>
      </header>
      <TaskForm
        initialValues={isEdit ? toFormValues(task) : blankValues(defaultStatus)}
        submitLabel={isEdit ? 'Save changes' : 'Create task'}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={isEdit ? handleDelete : undefined}
      />
    </Dialog>
  );
}
