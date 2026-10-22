import { Label } from '@/entities';
import { Label as LabelModel } from '@/models';
import { ILabelDAO } from '@/interfaces/label.interface';
import { Types } from 'mongoose';

export class LabelDAO implements ILabelDAO {
  async create(label: Label): Promise<Label> {
    const created = await LabelModel.create(label);
    return created as unknown as Label;
  }

  async update(
    id: Types.ObjectId | string,
    userId: string,
    label: Partial<Label>,
  ): Promise<Label | null> {
    const updated = await LabelModel.findOneAndUpdate({ _id: id, userId }, label, {
      new: true,
      runValidators: true,
    });
    return updated as unknown as Label | null;
  }

  async delete(id: Types.ObjectId | string, userId: string): Promise<boolean> {
    const deleted = await LabelModel.findOneAndDelete({ _id: id, userId });
    return deleted !== null;
  }
}
