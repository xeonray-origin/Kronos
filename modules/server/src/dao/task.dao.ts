import { Task } from '@/entities';
import { Task as TaskModel } from '@/models';
import { ITaskDAO } from '@/interfaces/task.interface';
import { Types } from 'mongoose';

export class TaskDAO implements ITaskDAO {
  async create(task: Task): Promise<Task> {
    const createdTask = await TaskModel.create(task);
    return createdTask as unknown as Task;
  }

  async update(
    id: Types.ObjectId | string,
    userId: string,
    task: Partial<Task>,
  ): Promise<Task | null> {
    const updated = await TaskModel.findOneAndUpdate({ _id: id, userId }, task, {
      new: true,
      runValidators: true,
    });
    return updated as unknown as Task | null;
  }

  async delete(id: Types.ObjectId | string, userId: string): Promise<boolean> {
    const deleted = await TaskModel.findOneAndDelete({ _id: id, userId });
    return deleted !== null;
  }

  async logTime(
    id: Types.ObjectId | string,
    userId: string,
    durationSeconds: number,
  ): Promise<Task | null> {
    const updated = await TaskModel.findOneAndUpdate(
      { _id: id, userId },
      { $inc: { timeSpentSeconds: durationSeconds } },
      { new: true, runValidators: true },
    );
    return updated as unknown as Task | null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ userId });
    return tasks as unknown as Task[];
  }
}
