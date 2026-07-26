import { IAction, ILabelDAO } from '@/interfaces';

class DeleteLabel implements IAction<string, boolean> {
  constructor(protected labelDAO: ILabelDAO) {}

  async call(id: string): Promise<boolean> {
    return await this.labelDAO.delete(id);
  }
}

export default DeleteLabel;
