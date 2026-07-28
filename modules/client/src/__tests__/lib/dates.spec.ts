import { formatDueDate } from '@/lib/dates';

describe('formatDueDate', () => {
  it('formats an ISO date string for display', () => {
    expect(formatDueDate('2026-07-20')).toBe('Jul 20, 2026');
  });

  it('returns the raw value unchanged when it is not a parseable ISO date', () => {
    expect(formatDueDate('Jul 20, 2026')).toBe('Jul 20, 2026');
  });
});
