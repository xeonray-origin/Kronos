import { Card, CardContent } from '../base/card';

interface TaskProps {
  title: string;
  description: string;
  dueDate: string;
}

export function Task({ title }: TaskProps) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-center gap-3">
          <input type="radio" className="h-4 w-4 shrink-0 accent-primary" />
          <span className="text-sm">{title}</span>
        </div>
      </CardContent>
    </Card>
  );
}
