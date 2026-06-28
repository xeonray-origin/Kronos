export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  label?: string;
  priority?: 'none' | 'low' | 'medium' | 'high';
  project?: string;
  userId: string;
}
