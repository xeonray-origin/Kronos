import { useState, type ChangeEvent } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, XIcon } from 'lucide-react';
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/base';
import { cn } from '@/lib/utils';
import type { DatePickerProps } from '@/types';

function hasTimeOf(date?: Date) {
  return !!date && (date.getHours() !== 0 || date.getMinutes() !== 0);
}

export function formatDatePickerValue(date: Date) {
  return format(date, hasTimeOf(date) ? 'PP p' : 'PP');
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [timeSet, setTimeSet] = useState(() => hasTimeOf(value));
  const showTime = timeSet;

  const handleSelect = (day?: Date) => {
    if (!day) {
      onChange(undefined);
      setTimeSet(false);
      return;
    }
    const next = new Date(day);
    next.setHours(value?.getHours() ?? 0, value?.getMinutes() ?? 0, 0, 0);
    onChange(next);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!value) return;
    const next = new Date(value);
    const match = /^(\d{2}):(\d{2})$/.exec(e.target.value);
    if (!match) {
      next.setHours(0, 0, 0, 0);
      setTimeSet(false);
    } else {
      next.setHours(Number(match[1]), Number(match[2]), 0, 0);
      setTimeSet(true);
    }
    onChange(next);
  };

  const clear = () => {
    onChange(undefined);
    setTimeSet(false);
    setOpen(false);
  };

  const label = value ? format(value, showTime ? 'PP p' : 'PP') : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-start font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon data-icon="inline-start" className="text-muted-foreground" />
          <span className="flex-1 text-left">{label}</span>
          {value && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                clear();
              }}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleSelect} autoFocus />
        <div className="flex items-center gap-2 border-t border-border p-2.5">
          <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            type="time"
            aria-label="Time"
            value={value && showTime ? format(value, 'HH:mm') : ''}
            onChange={handleTimeChange}
            disabled={!value}
            className="h-7"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
