import CreateTask from '@/actions/task/create';
import { Task } from '@/entities';
import { ITaskDAO, IValidator } from '@/interfaces';
import { Types } from 'mongoose';
import { ZodError } from 'zod';

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

  it('throws a ValidationError with joined messages from a ZodError', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: taskInput,
      errors: new ZodError([
        { code: 'custom', path: ['title'], message: 'Title is required and cannot be empty' },
        { code: 'custom', path: ['userId'], message: 'userId is required' },
      ]),
    });

    await expect(action.call(taskInput)).rejects.toThrow(
      'Validation failed: Title is required and cannot be empty, userId is required',
    );
    expect(mockTaskDAO.create).not.toHaveBeenCalled();
  });

  it('throws a ValidationError when errors are a plain string array', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: taskInput,
      errors: ['Title is required and cannot be empty'],
    });

    await expect(action.call(taskInput)).rejects.toThrow(
      'Validation failed: Title is required and cannot be empty',
    );
  });

  it('throws a ValidationError with no messages when errors are omitted', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: taskInput,
    });

    await expect(action.call(taskInput)).rejects.toThrow('Validation failed: ');
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
