import { Task } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, ITaskDAO, IValidator } from '@/interfaces';
import { assertValid } from '@/utils';

class UpdateTask implements IAction<Task> {
  constructor(
    protected validator: IValidator<Task>,
    protected taskDAO: ITaskDAO,
  ) {}

  async call(id: string, userId: string, payload: Partial<Task>): Promise<Task> {
    const value = assertValid(this.validator, payload);
    const updated = await this.taskDAO.update(id, userId, value);
    if (!updated) throw new ValidationError('Task not found', undefined, 404);
    return updated;
  }
}

export default UpdateTask;
