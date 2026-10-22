import { Types } from 'mongoose';
import { LabelDAO } from '@/dao/label.dao';
import { Label as LabelModel } from '@/models';

jest.mock('@/models', () => ({
  Label: {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

const mockCreate = LabelModel.create as jest.Mock;
const mockFindOneAndUpdate = LabelModel.findOneAndUpdate as jest.Mock;
const mockFindOneAndDelete = LabelModel.findOneAndDelete as jest.Mock;

describe('LabelDAO', () => {
  let dao: LabelDAO;
  const userId = new Types.ObjectId();
  const labelId = new Types.ObjectId();
  const labelInput = { labels: ['work'], userId } as any;
  const labelDoc = { _id: labelId, ...labelInput };

  beforeEach(() => {
    dao = new LabelDAO();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns the created label document', async () => {
      mockCreate.mockResolvedValueOnce(labelDoc);
      const result = await dao.create(labelInput);
      expect(mockCreate).toHaveBeenCalledWith(labelInput);
      expect(result).toEqual(labelDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockCreate.mockRejectedValueOnce(new Error('DB write failed'));
      await expect(dao.create(labelInput)).rejects.toThrow('DB write failed');
    });
  });

  describe('update', () => {
    it('returns the updated label document scoped to the owner', async () => {
      const updatedDoc = { _id: labelId, ...labelInput, labels: ['personal'] };
      mockFindOneAndUpdate.mockResolvedValueOnce(updatedDoc);
      const result = await dao.update(labelId, userId.toString(), { labels: ['personal'] });
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: labelId, userId: userId.toString() },
        { labels: ['personal'] },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(updatedDoc);
    });

    it('returns null when the label is missing or owned by another user', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce(null);
      const result = await dao.update(labelId, 'other-user', { labels: ['x'] });
      expect(result).toBeNull();
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndUpdate.mockRejectedValueOnce(new Error('DB update failed'));
      await expect(dao.update(labelId, userId.toString(), { labels: ['x'] })).rejects.toThrow(
        'DB update failed',
      );
    });
  });

  describe('delete', () => {
    it('returns true after deleting the document scoped to the owner', async () => {
      mockFindOneAndDelete.mockResolvedValueOnce(labelDoc);
      const result = await dao.delete(labelId, userId.toString());
      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        _id: labelId,
        userId: userId.toString(),
      });
      expect(result).toBe(true);
    });

    it('returns false when the label is missing or owned by another user', async () => {
      mockFindOneAndDelete.mockResolvedValueOnce(null);
      const result = await dao.delete(labelId, 'other-user');
      expect(result).toBe(false);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));
      await expect(dao.delete(labelId, userId.toString())).rejects.toThrow('DB delete failed');
    });
  });
});
