import CreateLabel from '@/actions/label/create';
import { Label } from '@/entities';
import { ILabelDAO } from '@/interfaces';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId();
const userId = new Types.ObjectId();
const labelInput = { labels: ['work', 'urgent'], userId } as Label;
const labelDoc = { _id: labelId, ...labelInput } as Label;

const mockLabelDAO: ILabelDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateLabel', () => {
  let action: CreateLabel;

  beforeEach(() => {
    action = new CreateLabel(mockLabelDAO);
    jest.clearAllMocks();
  });

  it('delegates to labelDAO.create and returns the result', async () => {
    (mockLabelDAO.create as jest.Mock).mockResolvedValueOnce(labelDoc);
    const result = await action.call(labelInput);
    expect(mockLabelDAO.create).toHaveBeenCalledWith(labelInput);
    expect(result).toEqual(labelDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockLabelDAO.create as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(labelInput)).rejects.toThrow('DAO error');
  });
});
