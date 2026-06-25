import { Task, User } from '@/entities';
import { Task as TaskModel } from '@/models';
import { ITaskDAO } from '@/interfaces/task.interface';
import { ObjectId, Types } from 'mongoose';

export class TaskDAO implements ITaskDAO {
  async create(task: Task): Promise<Task> {
    const createdTask = await TaskModel.create(task);
    return createdTask as unknown as Task;
  }

  async update(id: Types.ObjectId | string, task: Partial<Task>): Promise<Task> {
    const updated = await TaskModel.findByIdAndUpdate(id, task, { new: true });
    return updated as unknown as Task;
  }

  async delete(id: Types.ObjectId | string): Promise<boolean> {
    await TaskModel.findByIdAndDelete(id);
    return true;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ userId });
    return tasks as unknown as Task[];
  }
}
