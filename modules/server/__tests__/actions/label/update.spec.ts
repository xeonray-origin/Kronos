import UpdateLabel from '@/actions/label/update';
import { Label } from '@/entities';
import { ILabelDAO } from '@/interfaces';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId();
const userId = new Types.ObjectId();
const labelDoc = { _id: labelId, labels: ['work'], userId } as Label;

const mockLabelDAO: ILabelDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateLabel', () => {
  let action: UpdateLabel;

  beforeEach(() => {
    action = new UpdateLabel(mockLabelDAO);
    jest.clearAllMocks();
  });

  it('delegates to labelDAO.update and returns the result', async () => {
    (mockLabelDAO.update as jest.Mock).mockResolvedValueOnce(labelDoc);
    const result = await action.call(labelId.toString(), { labels: ['work'] });
    expect(mockLabelDAO.update).toHaveBeenCalledWith(labelId.toString(), { labels: ['work'] });
    expect(result).toEqual(labelDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockLabelDAO.update as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(labelId.toString(), { labels: ['x'] })).rejects.toThrow('DAO error');
  });
});
