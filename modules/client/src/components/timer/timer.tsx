import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/base/button';
import { cn } from '@/lib/utils';

interface TimerProps {
  initialMinutes?: number;
  label?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Timer({ initialMinutes = 25, label = 'FOCUS' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  function handleToggle() {
    if (timeLeft === 0) return;
    setIsRunning((r) => !r);
  }

  return (
    <div className={cn('flex flex-col items-center gap-6')}>
      <div
        className="flex size-48 flex-col items-center justify-center gap-1 
      rounded-full border-[8px] border-destructive"
      >
        <span className="tabular-nums text-4xl font-bold text-foreground">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <Button
        variant="destructive"
        size="lg"
        className="w-full max-w-48 gap-2 rounded-full bg-destructive text-white hover:bg-destructive/90"
        onClick={handleToggle}
      >
        {isRunning ? <Pause /> : <Play />}
        {isRunning ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
}
