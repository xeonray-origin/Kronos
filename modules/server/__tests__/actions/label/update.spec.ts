import UpdateLabel from '@/actions/label/update';
import { Label } from '@/entities';
import { ILabelDAO, IValidator } from '@/interfaces';
import { labelUpdateValidator } from '@/utils';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId().toString();
const userId = new Types.ObjectId().toString();
const labelDoc = { _id: new Types.ObjectId(labelId), labels: ['work'] } as Label;

const mockLabelDAO: ILabelDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateLabel', () => {
  let action: UpdateLabel;

  beforeEach(() => {
    action = new UpdateLabel(labelUpdateValidator as unknown as IValidator<Label>, mockLabelDAO);
    jest.clearAllMocks();
  });

  it('delegates to labelDAO.update scoped to the user and returns the result', async () => {
    (mockLabelDAO.update as jest.Mock).mockResolvedValueOnce(labelDoc);
    const result = await action.call(labelId, userId, { labels: ['work'] });
    expect(mockLabelDAO.update).toHaveBeenCalledWith(labelId, userId, { labels: ['work'] });
    expect(result).toEqual(labelDoc);
  });

  it('strips userId from the payload so ownership cannot be reassigned', async () => {
    (mockLabelDAO.update as jest.Mock).mockResolvedValueOnce(labelDoc);
    await action.call(labelId, userId, { labels: ['work'], userId: 'attacker' } as Partial<Label>);
    expect(mockLabelDAO.update).toHaveBeenCalledWith(labelId, userId, { labels: ['work'] });
  });

  it('throws a validation error and skips the DAO when the payload is invalid', async () => {
    await expect(
      action.call(labelId, userId, { labels: 'work' } as unknown as Partial<Label>),
    ).rejects.toMatchObject({ httpStatusCode: 422 });
    expect(mockLabelDAO.update).not.toHaveBeenCalled();
  });

  it('throws a 404 when the label is missing or owned by another user', async () => {
    (mockLabelDAO.update as jest.Mock).mockResolvedValueOnce(null);
    await expect(action.call(labelId, 'other-user', { labels: ['x'] })).rejects.toMatchObject({
      message: 'Label not found',
      httpStatusCode: 404,
    });
  });

  it('propagates errors from the DAO', async () => {
    (mockLabelDAO.update as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(labelId, userId, { labels: ['x'] })).rejects.toThrow('DAO error');
  });
});
