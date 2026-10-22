import { Label } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, ILabelDAO, IValidator } from '@/interfaces';
import { assertValid } from '@/utils';

class UpdateLabel implements IAction<Label> {
  constructor(
    protected validator: IValidator<Label>,
    protected labelDAO: ILabelDAO,
  ) {}

  async call(id: string, userId: string, payload: Partial<Label>): Promise<Label> {
    const value = assertValid(this.validator, payload);
    const updated = await this.labelDAO.update(id, userId, value);
    if (!updated) throw new ValidationError('Label not found', undefined, 404);
    return updated;
  }
}

export default UpdateLabel;
