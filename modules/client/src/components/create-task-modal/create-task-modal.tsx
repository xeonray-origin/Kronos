import { useState, type ChangeEvent, type ComponentProps } from 'react';
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
import type { CreateTaskModalProps } from '@/types';

const EMPTY_FORM = { title: '', description: '', dueDate: '' };

export function CreateTaskModal({ open, onClose, onSubmit }: CreateTaskModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [labels, setLabels] = useState<string[]>([]);

  const handleChange =
    (field: keyof typeof EMPTY_FORM) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const reset = () => {
    setForm(EMPTY_FORM);
    setLabels([]);
  };

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description || undefined,
      dueDate: form.dueDate || undefined,
      labels: labels.length > 0 ? labels : undefined,
    });
    reset();
    onClose();
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
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="task-due-date">
              Due date
            </label>
            <Input
              id="task-due-date"
              placeholder="e.g. Today, Tomorrow"
              value={form.dueDate}
              onChange={handleChange('dueDate')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Labels</span>
            <LabelPicker value={labels} onChange={setLabels} />
          </div>
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
