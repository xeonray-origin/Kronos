import { createTask, getTasks, updateTask } from '@/api/task.api';
import client from '@/api/client';
import { TaskStatus } from '@/types';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));

describe('getTasks', () => {
  it('calls GET /task and maps _id onto id', async () => {
    (client.get as jest.Mock).mockResolvedValue({
      data: [{ _id: '1', title: 'Task', userId: 'u1' }],
    });

    const result = await getTasks();

    expect(client.get).toHaveBeenCalledWith('/task');
    expect(result).toEqual([{ id: '1', title: 'Task', userId: 'u1' }]);
  });

  it('rejects when the request fails', async () => {
    (client.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(getTasks()).rejects.toThrow('Network error');
  });
});

describe('createTask', () => {
  const input = { title: 'New task', dueDate: '2026-07-20', labels: ['planning'] };

  it('posts to /task/create and maps _id onto id', async () => {
    (client.post as jest.Mock).mockResolvedValue({
      data: { _id: '2', userId: 'u1', status: 'BACKLOG', ...input },
    });

    const result = await createTask(input);

    expect(client.post).toHaveBeenCalledWith('/task/create', input);
    expect(result).toEqual({ id: '2', userId: 'u1', status: 'BACKLOG', ...input });
  });

  it('rejects when the request fails', async () => {
    (client.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(createTask(input)).rejects.toThrow('Network error');
  });
});

describe('updateTask', () => {
  const patch = { status: TaskStatus.DONE };

  it('puts to /task/update/:id and maps _id onto id', async () => {
    (client.put as jest.Mock).mockResolvedValue({
      data: { _id: '3', userId: 'u1', title: 'Task', status: 'DONE' },
    });

    const result = await updateTask('3', patch);

    expect(client.put).toHaveBeenCalledWith('/task/update/3', patch);
    expect(result).toEqual({ id: '3', userId: 'u1', title: 'Task', status: 'DONE' });
  });

  it('rejects when the request fails', async () => {
    (client.put as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(updateTask('3', patch)).rejects.toThrow('Network error');
  });
});
