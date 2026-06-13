import { Task } from '@/entities';
import { IAction, ITaskDAO } from '@/interfaces';

class CreateTask implements IAction<Task> {
  constructor(protected taskDAO: ITaskDAO) {}

  async call(payload: Task): Promise<Task> {
    return await this.taskDAO.create(payload);
  }
}

export default CreateTask;
