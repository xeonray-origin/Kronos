import DeleteLabel from '@/actions/label/delete';
import { ILabelDAO } from '@/interfaces';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId();

const mockLabelDAO: ILabelDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteLabel', () => {
  let action: DeleteLabel;

  beforeEach(() => {
    action = new DeleteLabel(mockLabelDAO);
    jest.clearAllMocks();
  });

  it('delegates to labelDAO.delete and returns true', async () => {
    (mockLabelDAO.delete as jest.Mock).mockResolvedValueOnce(true);
    const result = await action.call(labelId.toString());
    expect(mockLabelDAO.delete).toHaveBeenCalledWith(labelId.toString());
    expect(result).toBe(true);
  });

  it('propagates errors from the DAO', async () => {
    (mockLabelDAO.delete as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(labelId.toString())).rejects.toThrow('DAO error');
  });
});
