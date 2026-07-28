import { format, parseISO } from 'date-fns';

export function formatDueDate(dueDate: string) {
  return format(parseISO(dueDate), 'PP');
}
