import { BellIcon, CalendarIcon, CircleDotIcon } from 'lucide-react';

interface TaskProps {
  title: string;
  dueDate?: string;
  label?: string;
  project?: string;
  description?: string;
}

export function Task({ title, dueDate, label, project }: TaskProps) {
  return (
    <div className="flex items-center gap-3 border-t border-border px-4 py-3 hover:bg-muted/30 transition-colors">
      <button
        className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/40 hover:border-primary transition-colors"
        aria-label="Complete task"
      />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-foreground leading-snug truncate">{title}</span>
        {(dueDate || label) && (
          <div className="flex items-center gap-3">
            {dueDate && (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <CalendarIcon className="h-3 w-3" />
                {dueDate}
              </span>
            )}
            {label && (
              <span className="flex items-center gap-1 text-xs text-emerald-500">
                <CircleDotIcon className="h-3 w-3" />
                {label}
              </span>
            )}
          </div>
        )}
      </div>
      {project && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <span>{project}</span>
          <BellIcon className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
