import { useState, type ChangeEvent, type ComponentProps } from 'react';
import { format } from 'date-fns';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/components/base';
import { LabelPicker } from '@/components/label-picker';
import { DatePicker } from '@/components/date-picker';
import {
  CreateTaskValidator,
  type ValidationError,
} from '@/utils/validators/create-task.validator';
import type { CreateTaskInput, CreateTaskModalProps } from '@/types';

const EMPTY_FORM = { title: '', description: '' };

export function CreateTaskModal({ open, onClose, onSubmit }: CreateTaskModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string>();

  const fieldError = (field: ValidationError['field']) =>
    errors.find((error) => error.field === field)?.message;

  const clearFieldError = (field: ValidationError['field']) =>
    setErrors((prev) => prev.filter((error) => error.field !== field));

  const handleChange =
    (field: keyof typeof EMPTY_FORM) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      clearFieldError(field);
    };

  const handleLabelsChange = (next: string[]) => {
    setLabels(next);
    clearFieldError('labels');
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setLabels([]);
    setDueDate(undefined);
    setErrors([]);
    setSubmitError(undefined);
  };

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (e) => {
    e.preventDefault();
    const input: CreateTaskInput = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
      labels: labels.length ? labels : undefined,
    };

    const result = CreateTaskValidator.validate(input);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    setSubmitError(undefined);
    try {
      await onSubmit(input);
      reset();
      onClose();
    } catch {
      setSubmitError('Failed to create task. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        /* istanbul ignore else -- open is prop-controlled; Radix only ever fires this with false */
        if (!open) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="task-title">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange('title')}
              autoFocus
            />
            {fieldError('title') && (
              <span className="text-xs text-destructive">{fieldError('title')}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              placeholder="Add a description..."
              value={form.description}
              onChange={handleChange('description')}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-input/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            {fieldError('description') && (
              <span className="text-xs text-destructive">{fieldError('description')}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Due date</span>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Labels</span>
            <LabelPicker value={labels} onChange={handleLabelsChange} />
            {fieldError('labels') && (
              <span className="text-xs text-destructive">{fieldError('labels')}</span>
            )}
          </div>
          {submitError && <span className="text-xs text-destructive">{submitError}</span>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.title.trim()}>
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
