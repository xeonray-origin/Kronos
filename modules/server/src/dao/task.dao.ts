import { Task, User } from '@/entities';
import { Task as TaskModel } from '@/models';
import { ITaskDAO } from '@/interfaces/task.interface';

export class TaskDAO implements ITaskDAO {
  async create(task: Task): Promise<Task> {
    const createdTask = await TaskModel.create(task);
    return createdTask as unknown as Task;
  }
}
