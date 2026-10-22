import { ValidationError } from '@/errors';
import { IAction, ILabelDAO } from '@/interfaces';

class DeleteLabel implements IAction<string, boolean> {
  constructor(protected labelDAO: ILabelDAO) {}

  async call(id: string, userId: string): Promise<boolean> {
    const deleted = await this.labelDAO.delete(id, userId);
    if (!deleted) throw new ValidationError('Label not found', undefined, 404);
    return true;
  }
}

export default DeleteLabel;
