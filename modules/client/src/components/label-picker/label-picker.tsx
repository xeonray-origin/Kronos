import { useState } from 'react';
import { CheckIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { Badge, Popover, PopoverContent, PopoverTrigger } from '@/components/base';
import { cn } from '@/lib/utils';
import { LABEL_CATALOG, labelColor } from '@/lib/labels';
import type { LabelPickerProps } from '@/types';

export function LabelPicker({ value, onChange }: LabelPickerProps) {
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
