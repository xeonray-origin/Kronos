import GetUserTasks from '@/actions/task/get-user-tasks';
import { Task } from '@/entities';
import { ITaskDAO } from '@/interfaces';
import { Types } from 'mongoose';

const userId = new Types.ObjectId();
const tasks: Task[] = [{ _id: new Types.ObjectId(), title: 'Task 1', userId } as Task];

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
};

describe('GetUserTasks', () => {
  let action: GetUserTasks;

  beforeEach(() => {
    action = new GetUserTasks(mockTaskDAO);
    jest.clearAllMocks();
  });

  it('delegates to taskDAO.findByUserId and returns the result', async () => {
    (mockTaskDAO.findByUserId as jest.Mock).mockResolvedValueOnce(tasks);

    const result = await action.call(userId.toString());

    expect(mockTaskDAO.findByUserId).toHaveBeenCalledWith(userId.toString());
    expect(result).toEqual(tasks);
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.findByUserId as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(userId.toString())).rejects.toThrow('DAO error');
  });
});
