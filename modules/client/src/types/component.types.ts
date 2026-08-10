import type { LucideIcon } from 'lucide-react';
import type { LabelSummary } from '@/lib/labels';
import type { CreateTaskInput, ITask } from './task.types';

export type { LabelGroup, LabelSummary } from '@/lib/labels';

export interface TopbarProps {
  appName?: string;
  onAddTask?: () => void;
  onToggleTheme: (value: boolean) => void;
  isDark?: boolean;
  isLoggedIn?: boolean;
}

export interface TimerProps {
  initialMinutes?: number;
  label?: string;
}

export interface NavLink {
  icon: LucideIcon;
  label: string;
  count?: number;
  active?: boolean;
}

export interface SidebarProps {
  user?: { name: string; avatarUrl?: string };
  links?: NavLink[];
  labels?: LabelSummary[];
  activeLabel?: string | null;
  onSelectLabel?: (label: string) => void;
}

export interface LabelItemProps extends LabelSummary {
  active?: boolean;
  onSelect?: (label: string) => void;
}

export interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => Promise<void>;
}

export interface LabelPickerProps {
  value: string[];
  onChange: (labels: string[]) => void;
}

export interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
}

export interface TaskProps extends ITask {
  handleTimer?: (taskId: string) => void;
  onToggleStatus?: (taskId: string) => void;
}

export interface TaskListProps {
  tasks: ITask[];
  activeLabel?: string | null;
  onSelectTimerTask?: (taskId: string) => void;
  onToggleStatus?: (taskId: string) => void;
}

export interface TimerTaskCardProps {
  task: ITask;
  onClose: () => void;
}
