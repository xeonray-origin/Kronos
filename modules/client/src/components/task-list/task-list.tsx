import { Task } from '@/components/task';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types';
import type { ITask, TaskListProps, TaskStatusType } from '@/types';

const GROUPS: { status: TaskStatusType; label: string; dotClass: string }[] = [
  { status: TaskStatus.TODO, label: 'To Do', dotClass: 'bg-muted-foreground' },
  { status: TaskStatus.IN_PROGRESS, label: 'In Progress', dotClass: 'bg-amber-500' },
  { status: TaskStatus.DONE, label: 'Done', dotClass: 'bg-emerald-500' },
];

export function TaskList({ tasks }: TaskListProps) {
  const grouped = tasks.reduce<Record<TaskStatusType, ITask[]>>(
    (acc, task) => {
      if (task.status !== TaskStatus.BACKLOG) {
        acc[task.status].push(task);
      }
      return acc;
    },
    { [TaskStatus.TODO]: [], [TaskStatus.IN_PROGRESS]: [], [TaskStatus.DONE]: [] },
  );

  const activeGroups = GROUPS.filter((g) => grouped[g.status].length > 0);

  if (activeGroups.length === 0) return null;

  const handleOnClickTimer = (taskId: string) => console.log(`Start timer for task ${taskId}`);
  return (
    <div className="flex flex-col gap-6">
      {activeGroups.map((g) => (
        <section key={g.status}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className={cn('size-2 rounded-full shrink-0', g.dotClass)} />
            <span className="text-sm font-medium text-foreground">{g.label}</span>
            <span className="text-sm text-muted-foreground">{grouped[g.status].length}</span>
          </div>
          <div className="rounded-xl border border-border bg-background divide-y divide-border overflow-hidden">
            {grouped[g.status].map(({ id, ...rest }) => (
              <Task key={id} handleTimer={handleOnClickTimer} {...rest} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
