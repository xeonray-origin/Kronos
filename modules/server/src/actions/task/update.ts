import { Task } from '@/entities';
import { IAction, ITaskDAO } from '@/interfaces';

class UpdateTask implements IAction<Task> {
  constructor(protected taskDAO: ITaskDAO) {}

  async call(id: string, payload: Partial<Task>): Promise<Task> {
    return await this.taskDAO.update(id, payload);
  }
}

export default UpdateTask;
