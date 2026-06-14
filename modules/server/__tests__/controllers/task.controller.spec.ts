import TaskController from '@/controllers/task.controller';
import { Task } from '@/entities';
import { IAction } from '@/interfaces';
import { Types } from 'mongoose';

const taskId = new Types.ObjectId();
const userId = new Types.ObjectId();

const taskDoc: Task = {
  _id: taskId,
  title: 'Fix bug',
  userId,
} as Task;

describe('TaskController', () => {
  let controller: TaskController;
  let mockCreateTask: jest.Mocked<IAction<Task>>;
  let mockUpdateTask: jest.Mocked<IAction<Task>>;
  let mockDeleteTask: jest.Mocked<IAction<string, boolean>>;

  beforeEach(() => {
    mockCreateTask = { call: jest.fn() };
    mockUpdateTask = { call: jest.fn() };
    mockDeleteTask = { call: jest.fn() };
    controller = new TaskController(mockCreateTask, mockUpdateTask, mockDeleteTask);
  });

  describe('create', () => {
    it('delegates to createTask action and returns the result', async () => {
      const body = { title: 'Fix bug', userId } as Task;
      mockCreateTask.call.mockResolvedValue(taskDoc);

      const result = await controller.create({ body });

      expect(mockCreateTask.call).toHaveBeenCalledWith(body);
      expect(result).toBe(taskDoc);
    });
  });

  describe('update', () => {
    it('delegates to updateTask action with id from params and body as payload', async () => {
      const body = { title: 'Updated title' };
      const id = taskId.toString();
      mockUpdateTask.call.mockResolvedValue(taskDoc);

      const result = await controller.update({ body, params: { id } });

      expect(mockUpdateTask.call).toHaveBeenCalledWith(id, body);
      expect(result).toBe(taskDoc);
    });
  });

  describe('delete', () => {
    it('delegates to deleteTask action with id from params', async () => {
      const id = taskId.toString();
      mockDeleteTask.call.mockResolvedValue(true);

      const result = await controller.delete({ params: { id } });

      expect(mockDeleteTask.call).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
