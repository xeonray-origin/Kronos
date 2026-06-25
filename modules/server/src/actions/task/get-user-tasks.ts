import { Task } from '@/entities';
import { IAction, ITaskDAO } from '@/interfaces';

class GetUserTasks implements IAction<string, Task[]> {
  constructor(protected taskDAO: ITaskDAO) {}

  async call(userId: string): Promise<Task[]> {
    return await this.taskDAO.findByUserId(userId);
  }
}

export default GetUserTasks;
