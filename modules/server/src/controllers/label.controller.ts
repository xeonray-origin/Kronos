import { Label } from '@/entities';
import { IAction, IRequest } from '@/interfaces';

export default class LabelController {
  constructor(
    protected createLabel: IAction<Label>,
    protected updateLabel: IAction<Label>,
    protected deleteLabel: IAction<string, boolean>,
  ) {}

  async create(request: IRequest): Promise<Label> {
    const { body: payload } = request;
    return this.createLabel.call(payload);
  }

  async update(request: IRequest): Promise<Label> {
    const id = request.params?.id as string;
    const payload = request.body as Partial<Label>;
    return this.updateLabel.call(id, payload);
  }

  async delete(request: IRequest): Promise<boolean> {
    const id = request.params?.id as string;
    return this.deleteLabel.call(id);
  }
}
