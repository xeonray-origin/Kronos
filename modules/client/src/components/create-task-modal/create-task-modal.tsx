import { useState, type ChangeEvent, type ComponentProps } from 'react';
import { CheckIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/base';
import { cn } from '@/lib/utils';
import { LABEL_CATALOG, labelColor } from '@/lib/labels';
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

interface LabelPickerProps {
  value: string[];
  onChange: (labels: string[]) => void;
}

function LabelPicker({ value, onChange }: LabelPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggle = (label: string) => {
    onChange(value.includes(label) ? value.filter((l) => l !== label) : [...value, label]);
  };

  const q = query.trim().toLowerCase();
  const suggestions = LABEL_CATALOG.filter((l) => l.toLowerCase().includes(q));
  const canCreate =
    q.length > 0 && ![...LABEL_CATALOG, ...value].some((l) => l.toLowerCase() === q);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-input/30 px-2.5 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {value.length === 0 ? (
            <span className="text-sm text-muted-foreground">Add labels...</span>
          ) : (
            value.map((label) => (
              <Badge key={label} className={cn('gap-1 border-transparent', labelColor(label).chip)}>
                {label}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${label}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggle(label);
                  }}
                  className="rounded-full hover:opacity-70"
                >
                  <XIcon className="size-3" />
                </span>
              </Badge>
            ))
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <div className="flex items-center gap-2 border-b border-border px-2.5">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labels..."
            className="h-9 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-56 overflow-y-auto p-1">
          {suggestions.map((label) => {
            const selected = value.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggle(label)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span className={cn('size-2.5 shrink-0 rounded-full', labelColor(label).dot)} />
                <span className="flex-1 truncate text-left text-foreground">{label}</span>
                {selected && <CheckIcon className="size-4 shrink-0 text-foreground" />}
              </button>
            );
          })}
          {canCreate && (
            <button
              type="button"
              onClick={() => {
                toggle(query.trim());
                setQuery('');
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-left text-foreground">
                Create &ldquo;{query.trim()}&rdquo;
              </span>
            </button>
          )}
          {suggestions.length === 0 && !canCreate && (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">No labels found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
