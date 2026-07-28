import { formatDueDate } from '@/lib/dates';

describe('formatDueDate', () => {
  it('formats an ISO date string for display', () => {
    expect(formatDueDate('2026-07-20')).toBe('Jul 20, 2026');
  });
});
