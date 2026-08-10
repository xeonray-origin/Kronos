import { Types } from 'mongoose';
import { TaskDAO } from '@/dao/task.dao';
import { Task as TaskModel } from '@/models';

jest.mock('@/models', () => ({
  Task: {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

const mockCreate = TaskModel.create as jest.Mock;
const mockFindOneAndUpdate = TaskModel.findOneAndUpdate as jest.Mock;
const mockFindOneAndDelete = TaskModel.findOneAndDelete as jest.Mock;
const mockFind = TaskModel.find as jest.Mock;

describe('TaskDAO', () => {
  let dao: TaskDAO;

  const userId = new Types.ObjectId();
  const taskId = new Types.ObjectId();
  const taskInput = {
    title: 'Fix bug',
    description: 'Resolve the login issue',
    userId,
  } as any;
  const taskDoc = {
    _id: taskId,
    ...taskInput,
  };

  beforeEach(() => {
    dao = new TaskDAO();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns the created task document', async () => {
      mockCreate.mockResolvedValueOnce(taskDoc);

      const result = await dao.create(taskInput);

      expect(mockCreate).toHaveBeenCalledWith(taskInput);
      expect(result).toEqual(taskDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockCreate.mockRejectedValueOnce(new Error('DB write failed'));

      await expect(dao.create(taskInput)).rejects.toThrow('DB write failed');
    });
  });

  describe('update', () => {
    it('scopes the update to the owner and returns the updated document', async () => {
      const updatedDoc = { _id: taskId, ...taskInput, title: 'Updated title' };
      mockFindOneAndUpdate.mockResolvedValueOnce(updatedDoc);

      const result = await dao.update(taskId, userId.toString(), { title: 'Updated title' });

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: taskId, userId: userId.toString() },
        { title: 'Updated title' },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(updatedDoc);
    });

    it('returns null when no owned task matches', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce(null);

      await expect(dao.update(taskId, userId.toString(), { title: 'x' })).resolves.toBeNull();
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndUpdate.mockRejectedValueOnce(new Error('DB update failed'));

      await expect(dao.update(taskId, userId.toString(), { title: 'x' })).rejects.toThrow(
        'DB update failed',
      );
    });
  });

  describe('delete', () => {
    it('scopes the delete to the owner and returns true when a document was removed', async () => {
      mockFindOneAndDelete.mockResolvedValueOnce(taskDoc);

      const result = await dao.delete(taskId, userId.toString());

      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        _id: taskId,
        userId: userId.toString(),
      });
      expect(result).toBe(true);
    });

    it('returns false when no owned task matches', async () => {
      mockFindOneAndDelete.mockResolvedValueOnce(null);

      await expect(dao.delete(taskId, userId.toString())).resolves.toBe(false);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));

      await expect(dao.delete(taskId, userId.toString())).rejects.toThrow('DB delete failed');
    });
  });

  describe('findByUserId', () => {
    it('returns all tasks for the given userId', async () => {
      const tasks = [taskDoc];
      mockFind.mockResolvedValueOnce(tasks);

      const result = await dao.findByUserId(userId.toString());

      expect(mockFind).toHaveBeenCalledWith({ userId: userId.toString() });
      expect(result).toEqual(tasks);
    });

    it('propagates errors thrown by the model', async () => {
      mockFind.mockRejectedValueOnce(new Error('DB find failed'));

      await expect(dao.findByUserId(userId.toString())).rejects.toThrow('DB find failed');
    });
  });
});
