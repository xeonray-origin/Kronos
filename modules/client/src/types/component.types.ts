import type { LucideIcon } from 'lucide-react';
import type { CreateTaskInput, ITask } from './task.types';

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
  onSubmit: (task: CreateTaskInput) => void;
}

export interface TaskProps extends Omit<ITask, 'id'> {
  handleTimer?: (taskId: string) => void;
}

export interface TaskListProps {
  tasks: ITask[];
}
