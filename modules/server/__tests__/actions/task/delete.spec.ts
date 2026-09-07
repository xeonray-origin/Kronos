import DeleteTask from '@/actions/task/delete';
import { ITaskDAO } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
  logTime: jest.fn(),
};

describe('DeleteTask', () => {
  let action: DeleteTask;

  beforeEach(() => {
    action = new DeleteTask(mockTaskDAO);
    jest.clearAllMocks();
  });

  it('delegates to taskDAO.delete and returns true', async () => {
    (mockTaskDAO.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await action.call(taskId.toString(), userId.toString());

    expect(mockTaskDAO.delete).toHaveBeenCalledWith(taskId.toString(), userId.toString());
    expect(result).toBe(true);
  });

  it('throws a 404 when the task is missing or owned by another user', async () => {
    (mockTaskDAO.delete as jest.Mock).mockResolvedValueOnce(false);

    await expect(action.call(taskId.toString(), userId.toString())).rejects.toMatchObject({
      message: 'Task not found',
      httpStatusCode: 404,
    });
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.delete as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskId.toString(), userId.toString())).rejects.toThrow('DAO error');
  });
});
