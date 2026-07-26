import { Types } from 'mongoose';
import { LabelDAO } from '@/dao/label.dao';
import { Label as LabelModel } from '@/models';

jest.mock('@/models', () => ({
  Label: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockCreate = LabelModel.create as jest.Mock;
const mockFindByIdAndUpdate = LabelModel.findByIdAndUpdate as jest.Mock;
const mockFindByIdAndDelete = LabelModel.findByIdAndDelete as jest.Mock;

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
    it('returns the updated label document', async () => {
      const updatedDoc = { _id: labelId, ...labelInput, labels: ['personal'] };
      mockFindByIdAndUpdate.mockResolvedValueOnce(updatedDoc);
      const result = await dao.update(labelId, { labels: ['personal'] });
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        labelId,
        { labels: ['personal'] },
        { new: true },
      );
      expect(result).toEqual(updatedDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndUpdate.mockRejectedValueOnce(new Error('DB update failed'));
      await expect(dao.update(labelId, { labels: ['x'] })).rejects.toThrow('DB update failed');
    });
  });

  describe('delete', () => {
    it('returns true after deleting the document', async () => {
      mockFindByIdAndDelete.mockResolvedValueOnce(null);
      const result = await dao.delete(labelId);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(labelId);
      expect(result).toBe(true);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));
      await expect(dao.delete(labelId)).rejects.toThrow('DB delete failed');
    });
  });
});
