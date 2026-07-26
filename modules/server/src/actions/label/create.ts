import { Label } from '@/entities';
import { IAction, ILabelDAO } from '@/interfaces';

class CreateLabel implements IAction<Label> {
  constructor(protected labelDAO: ILabelDAO) {}

  async call(payload: Label): Promise<Label> {
    return await this.labelDAO.create(payload);
  }
}

export default CreateLabel;
