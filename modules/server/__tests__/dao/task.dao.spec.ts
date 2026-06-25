import { Types } from 'mongoose';
import { TaskDAO } from '@/dao/task.dao';
import { Task as TaskModel } from '@/models';

jest.mock('@/models', () => ({
  Task: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

const mockCreate = TaskModel.create as jest.Mock;
const mockFindByIdAndUpdate = TaskModel.findByIdAndUpdate as jest.Mock;
const mockFindByIdAndDelete = TaskModel.findByIdAndDelete as jest.Mock;
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
    it('returns the updated task document', async () => {
      const updatedDoc = { _id: taskId, ...taskInput, title: 'Updated title' };
      mockFindByIdAndUpdate.mockResolvedValueOnce(updatedDoc);

      const result = await dao.update(taskId, { title: 'Updated title' });

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        { title: 'Updated title' },
        { new: true },
      );
      expect(result).toEqual(updatedDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndUpdate.mockRejectedValueOnce(new Error('DB update failed'));

      await expect(dao.update(taskId, { title: 'x' })).rejects.toThrow('DB update failed');
    });
  });

  describe('delete', () => {
    it('returns true after deleting the document', async () => {
      mockFindByIdAndDelete.mockResolvedValueOnce(null);

      const result = await dao.delete(taskId);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(true);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));

      await expect(dao.delete(taskId)).rejects.toThrow('DB delete failed');
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
