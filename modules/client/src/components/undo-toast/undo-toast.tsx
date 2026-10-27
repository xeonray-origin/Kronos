import { Button } from '@/components/base';
import type { UndoToastProps } from '@/types';

export function UndoToast({ items, onUndo }: UndoToastProps) {
  if (items.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2"
    >
      {items.map(({ id, title }) => (
        <div
          key={id}
          className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 text-sm shadow-lg"
        >
          <span className="max-w-64 truncate">Deleted &ldquo;{title}&rdquo;</span>
          <Button variant="ghost" size="sm" onClick={() => onUndo(id)}>
            Undo
          </Button>
        </div>
      ))}
    </div>
  );
}
