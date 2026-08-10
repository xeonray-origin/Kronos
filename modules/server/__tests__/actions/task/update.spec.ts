import UpdateTask from '@/actions/task/update';
import { Task } from '@/entities';
import { ITaskDAO, IValidator } from '@/interfaces';
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

const mockValidator: IValidator<Task> = { validate: jest.fn() };

describe('UpdateTask', () => {
  let action: UpdateTask;

  beforeEach(() => {
    action = new UpdateTask(mockValidator, mockTaskDAO);
    jest.clearAllMocks();
    (mockValidator.validate as jest.Mock).mockImplementation((value) => ({
      isValid: true,
      value,
    }));
  });

  it('validates the payload, delegates to taskDAO.update and returns the result', async () => {
    (mockTaskDAO.update as jest.Mock).mockResolvedValueOnce(taskDoc);

    const result = await action.call(taskId.toString(), userId.toString(), {
      title: 'Updated title',
    });

    expect(mockTaskDAO.update).toHaveBeenCalledWith(taskId.toString(), userId.toString(), {
      title: 'Updated title',
    });
    expect(result).toEqual(taskDoc);
  });

  it('throws when the payload is invalid', async () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      errors: ['Status must be BACKLOG or DONE'],
      value: {},
    });

    await expect(action.call(taskId.toString(), userId.toString(), { title: 'x' })).rejects.toThrow(
      'Validation failed: Status must be BACKLOG or DONE',
    );
    expect(mockTaskDAO.update).not.toHaveBeenCalled();
  });

  it('throws a 404 when the task is missing or owned by another user', async () => {
    (mockTaskDAO.update as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      action.call(taskId.toString(), userId.toString(), { title: 'x' }),
    ).rejects.toMatchObject({ message: 'Task not found', httpStatusCode: 404 });
  });

  it('propagates errors from the DAO', async () => {
    (mockTaskDAO.update as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));

    await expect(action.call(taskId.toString(), userId.toString(), { title: 'x' })).rejects.toThrow(
      'DAO error',
    );
  });
});
