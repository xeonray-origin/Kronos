import { getTasks } from '@/api/task.api';
import client from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

describe('getTasks', () => {
  it('calls GET /task and returns the response data', async () => {
    const mockTasks = [{ _id: '1', title: 'Task', userId: 'u1' }];
    (client.get as jest.Mock).mockResolvedValue({ data: mockTasks });

    const result = await getTasks();

    expect(client.get).toHaveBeenCalledWith('/task');
    expect(result).toEqual(mockTasks);
  });

  it('rejects when the request fails', async () => {
    (client.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(getTasks()).rejects.toThrow('Network error');
  });
});
