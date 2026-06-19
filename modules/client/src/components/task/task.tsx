import { BellIcon, CalendarIcon, CheckIcon, FlagIcon, ClockIcon } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { cn } from '@/lib/utils';

interface TaskProps {
  title: string;
  dueDate?: string;
  dueDateMuted?: boolean;
  label?: string;
  labels?: string[];
  project?: string;
  description?: string;
  priority?: 'none' | 'low' | 'medium' | 'high';
  completed?: boolean;
  progress?: { filled: number; total: number };
  flagColor?: 'orange' | 'blue' | 'gray';
  showTimer?: boolean;
}

const priorityCircleClass: Record<string, string> = {
  none: 'border-muted-foreground/40',
  low: 'border-blue-500',
  medium: 'border-amber-500',
  high: 'border-red-500',
};

const flagColorClass: Record<string, string> = {
  orange: 'text-amber-500',
  blue: 'text-blue-500',
  gray: 'text-muted-foreground',
};

export function Task({
  title,
  dueDate,
  dueDateMuted,
  label,
  labels,
  project,
  priority,
  completed,
  progress,
  flagColor,
  showTimer,
}: TaskProps) {
  const allLabels = labels ?? (label ? [label] : []);
  const hasRight = dueDate || allLabels.length > 0 || progress || flagColor || showTimer || project;

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
      <button
        className={cn(
          'h-5 w-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
          completed
            ? 'bg-emerald-500 border-emerald-500'
            : cn(priorityCircleClass[priority ?? 'none'], 'hover:border-primary'),
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
          {progress && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: progress.total }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'size-2 rounded-full',
                    i < progress.filled ? 'bg-red-500' : 'bg-muted',
                  )}
                />
              ))}
            </div>
          )}
          {allLabels.map((l) => (
            <Badge key={l} variant="secondary" className="text-xs">
              {l}
            </Badge>
          ))}
          {dueDate && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs',
                dueDateMuted ? 'text-muted-foreground' : 'text-destructive',
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {dueDate}
            </span>
          )}
          {project && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{project}</span>
              <BellIcon className="h-3.5 w-3.5" />
            </div>
          )}
          {flagColor && <FlagIcon className={cn('h-4 w-4', flagColorClass[flagColor])} />}
          {showTimer && <ClockIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
      )}
    </div>
  );
}
