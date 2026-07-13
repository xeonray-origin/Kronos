import { CalendarIcon, CheckIcon, ClockIcon } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';
import { labelColor } from '@/lib/labels';
import type { TaskProps } from '@/types';

const statusColors: Record<string, string> = {
  TODO: 'text-amber-500',
  'IN-PROGRESS': 'text-blue-500',
  DONE: 'text-muted-foreground',
};

export function Task({
  title,
  dueDate,
  labels,
  status,
  isCompleted: completed,
  handleTimer: showTimer,
}: TaskProps) {
  const hasLabels = labels !== undefined && labels.length > 0;
  const hasRight = dueDate || hasLabels || showTimer;

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
      <button
        className={cn(
          'h-5 w-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
          completed
            ? 'bg-emerald-500 border-emerald-500'
            : cn(statusColors[status ?? 'none'], 'hover:border-primary'),
        )}
        aria-label="Complete task"
      >
        {completed && <CheckIcon className="h-3 w-3 text-white" />}
      </button>
      <span
        className={cn(
          'flex-1 text-sm font-medium leading-snug truncate min-w-0',
          completed ? 'line-through text-muted-foreground' : 'text-foreground',
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
              {dueDate}
            </span>
          )}
          {showTimer && <ClockIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
      )}
    </div>
  );
}
