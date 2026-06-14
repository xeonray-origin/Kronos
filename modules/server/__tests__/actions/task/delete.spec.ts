import DeleteTask from '@/actions/task/delete';
import { Task } from '@/entities';
import { ITaskDAO } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteTask', () => {
  let action: DeleteTask;

  beforeEach(() => {
    action = new DeleteTask(mockTaskDAO);
    jest.clearAllMocks();
  });

  it('delegates to taskDAO.delete and returns true', async () => {
    (mockTaskDAO.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await action.call(taskId.toString());

    expect(mockTaskDAO.delete).toHaveBeenCalledWith(taskId.toString());
    expect(result).toBe(true);
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.delete as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskId.toString())).rejects.toThrow('DAO error');
  });
});
