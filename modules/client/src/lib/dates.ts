import { format, isValid, parseISO } from 'date-fns';

export function formatDueDate(dueDate: string) {
  const parsed = parseISO(dueDate);
  return isValid(parsed) ? format(parsed, 'PP') : dueDate;
}
