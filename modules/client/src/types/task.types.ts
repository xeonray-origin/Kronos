export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  DONE = 'DONE',
}

export type CreateTaskInput = Pick<ITask, 'title' | 'description' | 'dueDate' | 'labels'>;

export type UpdateTaskInput = Partial<
  Pick<ITask, 'title' | 'description' | 'dueDate' | 'labels' | 'status'>
>;

export type ITaskResponse = Omit<ITask, 'id'> & { _id?: string };

export interface ITask {
  id?: string;
  status: TaskStatus;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
}
