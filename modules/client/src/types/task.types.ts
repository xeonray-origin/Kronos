export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN-PROGRESS',
  DONE = 'DONE',
  BACKLOG = 'BACKLOG',
}

export type TaskStatusType = TaskStatus.TODO | TaskStatus.IN_PROGRESS | TaskStatus.DONE;

export type CreateTaskInput = Pick<ITask, 'title' | 'description' | 'dueDate' | 'labels'>;

export interface ITask {
  id?: string;
  status: TaskStatus | TaskStatus.BACKLOG;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
  isCompleted?: boolean;
}
