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
  let mockGetUserTasks: jest.Mocked<IAction<string, Task[]>>;
  let mockLogTaskTime: jest.Mocked<IAction<Task>>;

  beforeEach(() => {
    mockCreateTask = { call: jest.fn() };
    mockUpdateTask = { call: jest.fn() };
    mockDeleteTask = { call: jest.fn() };
    mockGetUserTasks = { call: jest.fn() };
    mockLogTaskTime = { call: jest.fn() };
    controller = new TaskController(
      mockCreateTask,
      mockUpdateTask,
      mockDeleteTask,
      mockGetUserTasks,
      mockLogTaskTime,
    );
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
    it('delegates to updateTask action with id and userId from params and body as payload', async () => {
      const body = { title: 'Updated title' };
      const id = taskId.toString();
      mockUpdateTask.call.mockResolvedValue(taskDoc);

      const result = await controller.update({ body, params: { id, userId: userId.toString() } });

      expect(mockUpdateTask.call).toHaveBeenCalledWith(id, userId.toString(), body);
      expect(result).toBe(taskDoc);
    });
  });

  describe('delete', () => {
    it('delegates to deleteTask action with id and userId from params', async () => {
      const id = taskId.toString();
      mockDeleteTask.call.mockResolvedValue(true);

      const result = await controller.delete({ params: { id, userId: userId.toString() } });

      expect(mockDeleteTask.call).toHaveBeenCalledWith(id, userId.toString());
      expect(result).toBe(true);
    });
  });

  describe('getByUser', () => {
    it('delegates to getUserTasks action with userId from params and returns the result', async () => {
      const tasks = [taskDoc];
      mockGetUserTasks.call.mockResolvedValue(tasks);

      const result = await controller.getByUser({ params: { userId: userId.toString() } });

      expect(mockGetUserTasks.call).toHaveBeenCalledWith(userId.toString());
      expect(result).toBe(tasks);
    });
  });

  describe('logTime', () => {
    it('delegates to logTaskTime action with id and userId from params and body as payload', async () => {
      const body = { durationSeconds: 390 };
      const id = taskId.toString();
      mockLogTaskTime.call.mockResolvedValue(taskDoc);

      const result = await controller.logTime({ body, params: { id, userId: userId.toString() } });

      expect(mockLogTaskTime.call).toHaveBeenCalledWith(id, userId.toString(), body);
      expect(result).toBe(taskDoc);
    });
  });
});
