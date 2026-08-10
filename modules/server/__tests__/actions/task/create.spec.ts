import CreateTask from '@/actions/task/create';
import { Task } from '@/entities';
import { ITaskDAO, IValidator } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const taskInput = { title: 'Fix bug', userId } as Task;
const parsedTask = { title: 'Fix bug', userId } as Task;
const taskDoc: Task = { _id: taskId, ...parsedTask } as Task;

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
};

const mockValidator: IValidator<Task> = {
  validate: jest.fn(),
};

describe('CreateTask', () => {
  let action: CreateTask;

  beforeEach(() => {
    action = new CreateTask(mockValidator, mockTaskDAO);
    jest.clearAllMocks();
  });

  it('creates the task from the validated value and returns the result', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: true,
      value: parsedTask,
    });
    (mockTaskDAO.create as jest.Mock).mockResolvedValueOnce(taskDoc);

    const result = await action.call(taskInput);

    expect(mockTaskDAO.create).toHaveBeenCalledWith(parsedTask);
    expect(result).toEqual(taskDoc);
  });

  it('throws and skips the DAO when the payload is invalid', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: taskInput,
      errors: ['Title is required and cannot be empty'],
    });

    await expect(action.call(taskInput)).rejects.toThrow(
      'Validation failed: Title is required and cannot be empty',
    );
    expect(mockTaskDAO.create).not.toHaveBeenCalled();
  });

  it('propagates errors from the DAO', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: true,
      value: parsedTask,
    });
    (mockTaskDAO.create as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskInput)).rejects.toThrow('DAO error');
  });
});
