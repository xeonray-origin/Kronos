import { Sun, Moon, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/base';
import type { TopbarProps } from '@/types';

export function Topbar({
  appName = 'Tempo',
  onAddTask,
  onToggleTheme,
  isDark = true,
  isLoggedIn = false,
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
        {isLoggedIn && (
          <Button variant="outline" size="sm" onClick={onAddTask}>
            <Plus className="size-4" />
            Add task
          </Button>
        )}
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
