import LogTaskTime from '@/actions/task/log-time';
import { Task } from '@/entities';
import { ITaskDAO, ITaskTimeInput, IValidator } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const payload: Partial<ITaskTimeInput> = { durationSeconds: 390 };
const parsedPayload: ITaskTimeInput = { durationSeconds: 390 };
const taskDoc: Task = {
  _id: taskId,
  title: 'Fix bug',
  userId,
  timeSpentSeconds: 390,
} as Task;

const mockTaskDAO: ITaskDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
  logTime: jest.fn(),
};

const mockValidator: IValidator<ITaskTimeInput> = { validate: jest.fn() };

describe('LogTaskTime', () => {
  let action: LogTaskTime;

  beforeEach(() => {
    action = new LogTaskTime(mockValidator, mockTaskDAO);
    jest.clearAllMocks();
  });

  it('logs the validated duration against the owned task and returns the updated task', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: true,
      value: parsedPayload,
    });
    (mockTaskDAO.logTime as jest.Mock).mockResolvedValueOnce(taskDoc);

    const result = await action.call(taskId.toString(), userId.toString(), payload);

    expect(mockTaskDAO.logTime).toHaveBeenCalledWith(taskId.toString(), userId.toString(), 390);
    expect(result).toEqual(taskDoc);
  });

  it('throws and skips the DAO when the payload is invalid', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: payload,
      errors: ['Duration must be greater than zero'],
    });

    await expect(action.call(taskId.toString(), userId.toString(), payload)).rejects.toThrow(
      'Validation failed: Duration must be greater than zero',
    );
    expect(mockTaskDAO.logTime).not.toHaveBeenCalled();
  });

  it('throws a 404 when no owned task matches', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: true,
      value: parsedPayload,
    });
    (mockTaskDAO.logTime as jest.Mock).mockResolvedValueOnce(null);

    await expect(action.call(taskId.toString(), userId.toString(), payload)).rejects.toMatchObject({
      message: 'Task not found',
      httpStatusCode: 404,
    });
  });

  it('propagates errors from the DAO', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: true,
      value: parsedPayload,
    });
    (mockTaskDAO.logTime as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskId.toString(), userId.toString(), payload)).rejects.toThrow(
      'DAO error',
    );
  });
});
