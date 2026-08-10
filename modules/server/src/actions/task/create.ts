import { Task } from '@/entities';
import { IAction, ITaskDAO, IValidator } from '@/interfaces';
import { assertValid } from '@/utils';

class CreateTask implements IAction<Task> {
  constructor(
    protected validator: IValidator<Task>,
    protected taskDAO: ITaskDAO,
  ) {}

  async call(payload: Partial<Task>): Promise<Task> {
    return await this.taskDAO.create(assertValid(this.validator, payload));
  }
}

export default CreateTask;
