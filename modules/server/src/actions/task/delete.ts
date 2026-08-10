import { ValidationError } from '@/errors';
import { IAction, ITaskDAO } from '@/interfaces';

class DeleteTask implements IAction<string, boolean> {
  constructor(protected taskDAO: ITaskDAO) {}

  async call(id: string, userId: string): Promise<boolean> {
    const deleted = await this.taskDAO.delete(id, userId);
    if (!deleted) throw new ValidationError('Task not found', undefined, 404);
    return true;
  }
}

export default DeleteTask;
