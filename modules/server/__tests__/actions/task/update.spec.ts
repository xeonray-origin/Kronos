import UpdateTask from '@/actions/task/update';
import { Task } from '@/entities';
import { ITaskDAO } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const taskDoc: Task = {
  _id: taskId,
  title: 'Updated title',
  userId,
} as Task;

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
};

describe('UpdateTask', () => {
  let action: UpdateTask;

  beforeEach(() => {
    action = new UpdateTask(mockTaskDAO);
    jest.clearAllMocks();
  });

  it('delegates to taskDAO.update and returns the result', async () => {
    (mockTaskDAO.update as jest.Mock).mockResolvedValueOnce(taskDoc);

    const result = await action.call(taskId.toString(), { title: 'Updated title' });

    expect(mockTaskDAO.update).toHaveBeenCalledWith(taskId.toString(), { title: 'Updated title' });
    expect(result).toEqual(taskDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.update as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskId.toString(), { title: 'x' })).rejects.toThrow('DAO error');
  });
});
