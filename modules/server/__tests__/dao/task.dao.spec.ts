import { Types } from 'mongoose';
import { TaskDAO } from '@/dao/task.dao';
import { Task as TaskModel } from '@/models';

jest.mock('@/models', () => ({
  Task: {
    create: jest.fn(),
  },
}));

const mockCreate = TaskModel.create as jest.Mock;

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
});
