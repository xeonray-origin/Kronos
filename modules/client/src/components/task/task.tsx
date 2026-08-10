import { CalendarIcon, CheckIcon, ClockIcon } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';
import { formatDueDate } from '@/lib/dates';
import { labelColor } from '@/lib/labels';
import { TaskStatus } from '@/types';
import type { TaskProps } from '@/types';

export function Task({
  id,
  title,
  dueDate,
  labels,
  status,
  handleTimer: showTimer,
  onToggleStatus,
}: TaskProps) {
  const done = status === TaskStatus.DONE;
  const hasLabels = labels !== undefined && labels.length > 0;
  const hasRight = dueDate || hasLabels || showTimer;

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
      <button
        type="button"
        onClick={id ? () => onToggleStatus?.(id) : undefined}
        className={cn(
          'h-5 w-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
          done
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-muted-foreground hover:border-primary',
        )}
        aria-label="Complete task"
      >
        {done && <CheckIcon className="h-3 w-3 text-white" />}
      </button>
      <span
        className={cn(
          'flex-1 text-sm font-medium leading-snug truncate min-w-0',
          done ? 'line-through text-muted-foreground' : 'text-foreground',
        )}
      >
        {title}
      </span>
      {hasRight && (
        <div className="flex items-center gap-2 shrink-0">
          {hasLabels && (
            <div className="flex items-center gap-1">
              {labels.map((label) => (
                <Badge key={label} className={cn('border-transparent', labelColor(label).chip)}>
                  {label}
                </Badge>
              ))}
            </div>
          )}
          {dueDate && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <CalendarIcon className="h-3 w-3" />
              {formatDueDate(dueDate)}
            </span>
          )}
          {showTimer && id && (
            <button
              type="button"
              onClick={() => showTimer(id)}
              aria-label="Toggle task timer card"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ClockIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
