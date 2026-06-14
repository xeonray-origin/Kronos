import CreateTask from '@/actions/task/create';
import { Task } from '@/entities';
import { ITaskDAO } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const taskInput = { title: 'Fix bug', userId } as Task;
const taskDoc: Task = { _id: taskId, ...taskInput } as Task;

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTask', () => {
  let action: CreateTask;

  beforeEach(() => {
    action = new CreateTask(mockTaskDAO);
    jest.clearAllMocks();
  });

  it('delegates to taskDAO.create and returns the result', async () => {
    (mockTaskDAO.create as jest.Mock).mockResolvedValueOnce(taskDoc);

    const result = await action.call(taskInput);

    expect(mockTaskDAO.create).toHaveBeenCalledWith(taskInput);
    expect(result).toEqual(taskDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.create as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskInput)).rejects.toThrow('DAO error');
  });
});
