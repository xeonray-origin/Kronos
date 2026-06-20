import { Sun, Moon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/base';

export interface TopbarProps {
  appName?: string;
  onAddTask?: () => void;
  onToggleTheme: (value: boolean) => void;
  placeholder?: string;
  isDark?: boolean;
}

export function Topbar({
  appName = 'Tempo',
  onAddTask,
  onToggleTheme,
  placeholder = 'Add a task...',
  isDark = true,
}: TopbarProps) {
  const handleToggleTheme = () => onToggleTheme(!isDark);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <span className="text-sm font-bold text-brand">{appName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-lg font-bold text-foreground">{appName}</span>
        </div>
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder={placeholder}
            className="h-9 bg-muted"
            readOnly
            onClick={onAddTask}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleToggleTheme} aria-label="Refresh">
            <Sun className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
