import DeleteProject from '@/actions/project/delete';
import { IProjectDAO } from '@/interfaces';
import { Types } from 'mongoose';

const projectId = new Types.ObjectId();

const mockProjectDAO: IProjectDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteProject', () => {
  let action: DeleteProject;

  beforeEach(() => {
    action = new DeleteProject(mockProjectDAO);
    jest.clearAllMocks();
  });

  it('delegates to projectDAO.delete and returns true', async () => {
    (mockProjectDAO.delete as jest.Mock).mockResolvedValueOnce(true);
    const result = await action.call(projectId.toString());
    expect(mockProjectDAO.delete).toHaveBeenCalledWith(projectId.toString());
    expect(result).toBe(true);
  });

  it('propagates errors from the DAO', async () => {
    (mockProjectDAO.delete as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(projectId.toString())).rejects.toThrow('DAO error');
  });
});
