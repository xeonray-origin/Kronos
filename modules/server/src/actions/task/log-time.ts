import { Task } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, ITaskDAO, ITaskTimeInput, IValidator } from '@/interfaces';
import { assertValid } from '@/utils';

class LogTaskTime implements IAction<Task> {
  constructor(
    protected validator: IValidator<ITaskTimeInput>,
    protected taskDAO: ITaskDAO,
  ) {}

  async call(id: string, userId: string, payload: Partial<ITaskTimeInput>): Promise<Task> {
    const { durationSeconds } = assertValid(this.validator, payload);
    const updated = await this.taskDAO.logTime(id, userId, durationSeconds);
    if (!updated) throw new ValidationError('Task not found', undefined, 404);
    return updated;
  }
}

export default LogTaskTime;
