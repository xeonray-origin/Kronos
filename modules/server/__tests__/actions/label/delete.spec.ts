import DeleteLabel from '@/actions/label/delete';
import { ILabelDAO } from '@/interfaces';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId().toString();
const userId = new Types.ObjectId().toString();

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

  it('delegates to labelDAO.delete scoped to the user and returns true', async () => {
    (mockLabelDAO.delete as jest.Mock).mockResolvedValueOnce(true);
    const result = await action.call(labelId, userId);
    expect(mockLabelDAO.delete).toHaveBeenCalledWith(labelId, userId);
    expect(result).toBe(true);
  });

  it('throws a 404 when the label is missing or owned by another user', async () => {
    (mockLabelDAO.delete as jest.Mock).mockResolvedValueOnce(false);
    await expect(action.call(labelId, 'other-user')).rejects.toMatchObject({
      message: 'Label not found',
      httpStatusCode: 404,
    });
  });

  it('propagates errors from the DAO', async () => {
    (mockLabelDAO.delete as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(labelId, userId)).rejects.toThrow('DAO error');
  });
});
