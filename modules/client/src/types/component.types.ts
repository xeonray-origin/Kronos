import type { LucideIcon } from 'lucide-react';
import type { NewTask, TaskFlagColor, TaskListItem, TaskPriority } from './task.types';

export interface TopbarProps {
  appName?: string;
  onAddTask?: () => void;
  onToggleTheme: (value: boolean) => void;
  isDark?: boolean;
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

export interface Project {
  name: string;
  emoji?: string;
  shared?: boolean;
  count?: number;
}

export interface SidebarProps {
  user?: { name: string; avatarUrl?: string };
  links?: NavLink[];
  projects?: Project[];
}

export interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask) => void;
}

export interface TaskProps {
  title: string;
  dueDate?: string;
  dueDateMuted?: boolean;
  label?: string;
  labels?: string[];
  project?: string;
  description?: string;
  priority?: TaskPriority;
  completed?: boolean;
  progress?: { filled: number; total: number };
  flagColor?: TaskFlagColor;
  showTimer?: boolean;
}

export interface TaskListProps {
  tasks: TaskListItem[];
}
