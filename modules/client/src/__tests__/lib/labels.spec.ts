import { groupTasksByLabel, labelColor, labelCounts } from '@/lib/labels';
import { TaskStatus, type ITask } from '@/types';

const task = (id: string, labels?: string[]): ITask => ({
  id,
  title: `Task ${id}`,
  userId: 'u1',
  status: TaskStatus.BACKLOG,
  ...(labels ? { labels } : {}),
});

describe('labelColor', () => {
  it('is stable for the same label and differs across labels', () => {
    expect(labelColor('frontend')).toBe(labelColor('frontend'));
    expect(labelColor('frontend')).not.toBe(labelColor('auth'));
  });

  it('returns the first color for an empty label', () => {
    expect(labelColor('').dot).toBe('bg-blue-500');
  });
});

describe('groupTasksByLabel', () => {
  it('returns no groups for an empty task list', () => {
    expect(groupTasksByLabel([])).toEqual([]);
  });

  it('buckets by label alphabetically, dedupes, and puts unlabeled tasks last', () => {
    const multi = task('1', ['frontend', 'auth']);
    const duplicated = task('2', ['frontend', 'frontend']);
    const emptyLabels = task('3', []);
    const noLabels = task('4');

    const groups = groupTasksByLabel([multi, duplicated, emptyLabels, noLabels]);

    expect(groups.map((group) => group.label)).toEqual(['auth', 'frontend', null]);
    expect(groups[0]!.tasks).toEqual([multi]);
    expect(groups[1]!.tasks).toEqual([multi, duplicated]);
    expect(groups[2]!.tasks).toEqual([emptyLabels, noLabels]);
  });
});

describe('labelCounts', () => {
  it('counts labeled groups and excludes the unlabeled bucket', () => {
    const counts = labelCounts([
      task('1', ['frontend', 'auth']),
      task('2', ['frontend']),
      task('3'),
    ]);

    expect(counts).toEqual([
      { label: 'auth', count: 1 },
      { label: 'frontend', count: 2 },
    ]);
  });
});
