export const LABEL_CATALOG = [
  'planning',
  'code-review',
  'frontend',
  'backend',
  'auth',
  'tooling',
  'design',
  'bug',
];

const LABEL_COLORS = [
  { chip: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  { chip: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { chip: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  { chip: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  { chip: 'bg-rose-500/15 text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
  { chip: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' },
  { chip: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  { chip: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400', dot: 'bg-fuchsia-500' },
];

export function labelColor(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return LABEL_COLORS[hash % LABEL_COLORS.length]!;
}
