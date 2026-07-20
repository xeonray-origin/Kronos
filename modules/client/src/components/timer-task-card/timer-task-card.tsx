import { XIcon } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/components/base';
import type { TimerTaskCardProps } from '@/types';

export function TimerTaskCard({ task, onClose }: TimerTaskCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        {task.description && <CardDescription>{task.description}</CardDescription>}
        <CardAction>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close task timer card">
            <XIcon className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-foreground mb-1">Sub-tasks</p>
        <p className="text-sm text-muted-foreground">No sub-tasks yet</p>
      </CardContent>
    </Card>
  );
}
