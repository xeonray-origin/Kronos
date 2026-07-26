import { Label } from '@/entities';
import { IAction, ILabelDAO } from '@/interfaces';

class UpdateLabel implements IAction<Label> {
  constructor(protected labelDAO: ILabelDAO) {}

  async call(id: string, payload: Partial<Label>): Promise<Label> {
    return await this.labelDAO.update(id, payload);
  }
}

export default UpdateLabel;
