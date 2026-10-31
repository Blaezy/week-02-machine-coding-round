import { useId, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { PRIORITIES, STATUSES } from '../../constants/index.js';
import { todayISO } from '../../utils/dates.js';
import { FIELD_ORDER, hasErrors, validateTask } from '../../utils/validation.js';
import Button from '../ui/Button.jsx';
import { Field, Input, Select, Textarea } from '../ui/Field.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import { priorityDot } from './PriorityBadge.jsx';

const priorityOptions = PRIORITIES.map(({ id, label }) => ({
  value: id,
  label,
  icon: <span aria-hidden="true" className={`size-1.5 rounded-full ${priorityDot(id)}`} />,
}));

export default function TaskForm({ initialValues, submitLabel, onSubmit, onCancel, onDelete }) {
  const uid = useId();
  const ids = Object.fromEntries(FIELD_ORDER.map((field) => [field, `${uid}-${field}`]));
  const originalDueDate = initialValues.dueDate;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const describe = (field) => (errors[field] ? `${ids[field]}-error` : undefined);

  function setField(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateTask(next, { originalDueDate }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateTask(values, { originalDueDate });
    setErrors(found);
    setAttempted(true);
    if (hasErrors(found)) {
      const first = FIELD_ORDER.find((field) => found[field]);
      document.getElementById(ids[first])?.focus();
      return;
    }
    onSubmit(values);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <Field id={ids.title} label="Title" error={errors.title}>
          <Input
            id={ids.title}
            data-autofocus
            value={values.title}
            onChange={(event) => setField('title', event.target.value)}
            placeholder="What needs to be done?"
            autoComplete="off"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={describe('title')}
          />
        </Field>

        <Field id={ids.description} label="Description" hint="Optional" error={errors.description}>
          <Textarea
            id={ids.description}
            value={values.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Add a few details"
            rows={3}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describe('description')}
          />
        </Field>

        <fieldset className="space-y-1.5">
          <legend className="text-[13px] font-medium">Priority</legend>
          <SegmentedControl
            name={ids.priority}
            label="Priority"
            value={values.priority}
            onChange={(value) => setField('priority', value)}
            options={priorityOptions}
          />
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={ids.status} label="Status" error={errors.status}>
            <Select
              id={ids.status}
              value={values.status}
              onChange={(event) => setField('status', event.target.value)}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={describe('status')}
            >
              {STATUSES.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field id={ids.dueDate} label="Due date" hint="Optional" error={errors.dueDate}>
            <Input
              id={ids.dueDate}
              type="date"
              min={todayISO()}
              value={values.dueDate}
              onChange={(event) => setField('dueDate', event.target.value)}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={describe('dueDate')}
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line px-5 py-3">
        {onDelete && (
          <Button variant="danger" onClick={onDelete} className="-ml-2">
            <LuTrash2 aria-hidden="true" className="size-4" />
            Delete
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
