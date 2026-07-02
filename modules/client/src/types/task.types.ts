export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskFlagColor = 'orange' | 'blue' | 'gray';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  label?: string;
  priority?: TaskPriority;
  project?: string;
  userId: string;
}

export interface TaskListItem {
  id: string;
  status: TaskStatus;
  title: string;
  dueDate?: string;
  dueDateMuted?: boolean;
  label?: string;
  labels?: string[];
  project?: string;
  priority?: TaskPriority;
  completed?: boolean;
  progress?: { filled: number; total: number };
  flagColor?: TaskFlagColor;
  showTimer?: boolean;
}

export interface NewTask {
  title: string;
  description?: string;
  dueDate?: string;
  project?: string;
}
