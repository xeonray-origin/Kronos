import { Task } from '@/entities';
import { IAction, ITaskDAO } from '@/interfaces';

class DeleteTask implements IAction<string, boolean> {
  constructor(protected taskDAO: ITaskDAO) {}

  async call(id: string): Promise<boolean> {
    return await this.taskDAO.delete(id);
  }
}

export default DeleteTask;
