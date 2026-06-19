import { Task } from '@/components/task';
import { cn } from '@/lib/utils';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface TaskListItem {
  id: string;
  status: TaskStatus;
  title: string;
  dueDate?: string;
  dueDateMuted?: boolean;
  label?: string;
  labels?: string[];
  project?: string;
  priority?: 'none' | 'low' | 'medium' | 'high';
  completed?: boolean;
  progress?: { filled: number; total: number };
  flagColor?: 'orange' | 'blue' | 'gray';
  showTimer?: boolean;
}

interface TaskListProps {
  tasks: TaskListItem[];
}

const GROUPS: { status: TaskStatus; label: string; dotClass: string }[] = [
  { status: 'todo', label: 'To Do', dotClass: 'bg-muted-foreground' },
  { status: 'in-progress', label: 'In Progress', dotClass: 'bg-amber-500' },
  { status: 'done', label: 'Done', dotClass: 'bg-emerald-500' },
];

export function TaskList({ tasks }: TaskListProps) {
  const grouped = tasks.reduce<Record<TaskStatus, TaskListItem[]>>(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    { todo: [], 'in-progress': [], done: [] },
  );

  const activeGroups = GROUPS.filter((g) => grouped[g.status].length > 0);

  if (activeGroups.length === 0) return null;

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
            {grouped[g.status].map(({ id, status, ...rest }) => (
              <Task key={id} {...rest} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
