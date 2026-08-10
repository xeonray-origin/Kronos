import { Task } from '@/components/task';
import { cn } from '@/lib/utils';
import { groupTasksByLabel, labelColor } from '@/lib/labels';
import type { TaskListProps } from '@/types';

const UNLABELED_KEY = '__unlabeled__';

export function TaskList({ tasks, activeLabel, onSelectTimerTask, onToggleStatus }: TaskListProps) {
  const groups = groupTasksByLabel(tasks);
  const visible = activeLabel ? groups.filter((group) => group.label === activeLabel) : groups;

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No tasks yet</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {visible.map(({ label, tasks: grouped }) => (
        <section key={label ?? UNLABELED_KEY}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span
              className={cn(
                'size-2 rounded-full shrink-0',
                label ? labelColor(label).dot : 'bg-muted-foreground',
              )}
            />
            <span className="text-sm font-medium text-foreground">{label ?? 'No label'}</span>
            <span className="text-sm text-muted-foreground">{grouped.length}</span>
          </div>
          <div className="rounded-xl border border-border bg-background divide-y divide-border overflow-hidden">
            {grouped.map((task) => (
              <Task
                key={task.id}
                handleTimer={onSelectTimerTask}
                onToggleStatus={onToggleStatus}
                {...task}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
