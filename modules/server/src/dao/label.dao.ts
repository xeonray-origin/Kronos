import { Label } from '@/entities';
import { Label as LabelModel } from '@/models';
import { ILabelDAO } from '@/interfaces/label.interface';
import { Types } from 'mongoose';

export class LabelDAO implements ILabelDAO {
  async create(label: Label): Promise<Label> {
    const created = await LabelModel.create(label);
    return created as unknown as Label;
  }

  async update(id: Types.ObjectId | string, label: Partial<Label>): Promise<Label> {
    const updated = await LabelModel.findByIdAndUpdate(id, label, { new: true });
    return updated as unknown as Label;
  }

  async delete(id: Types.ObjectId | string): Promise<boolean> {
    await LabelModel.findByIdAndDelete(id);
    return true;
  }
}
