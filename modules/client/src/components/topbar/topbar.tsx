import { Plus, RefreshCw, List, LayoutGrid } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/base';

export interface TopbarProps {
  appName?: string;
  onAddTask?: () => void;
  onViewChange?: (view: 'board' | 'list') => void;
  onRefresh?: () => void;
  currentView?: 'board' | 'list';
  placeholder?: string;
}

export function Topbar({
  appName = 'Tempo',
  onAddTask,
  onViewChange,
  onRefresh,
  currentView = 'board',
  placeholder = 'Add a task...',
}: TopbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <span className="text-sm font-bold text-brand">{appName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-lg font-bold text-foreground">{appName}</span>
        </div>

        {/* Search/Add Task Section */}
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder={placeholder}
            className="h-9 bg-muted"
            readOnly
            onClick={onAddTask}
          />
        </div>

        {/* Controls Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange?.('board')}
            aria-label="Board view"
            className={cn(currentView === 'board' && 'bg-accent text-accent-foreground')}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange?.('list')}
            aria-label="List view"
            className={cn(currentView === 'list' && 'bg-accent text-accent-foreground')}
          >
            <List className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Refresh">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
