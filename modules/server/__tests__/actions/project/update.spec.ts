import UpdateProject from '@/actions/project/update';
import { Project } from '@/entities';
import { IProjectDAO } from '@/interfaces';
import { Types } from 'mongoose';

const projectId = new Types.ObjectId();
const userId = new Types.ObjectId();
const projectDoc = { _id: projectId, name: 'Renamed', userId } as Project;

const mockProjectDAO: IProjectDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateProject', () => {
  let action: UpdateProject;

  beforeEach(() => {
    action = new UpdateProject(mockProjectDAO);
    jest.clearAllMocks();
  });

  it('delegates to projectDAO.update and returns the result', async () => {
    (mockProjectDAO.update as jest.Mock).mockResolvedValueOnce(projectDoc);
    const result = await action.call(projectId.toString(), { name: 'Renamed' });
    expect(mockProjectDAO.update).toHaveBeenCalledWith(projectId.toString(), { name: 'Renamed' });
    expect(result).toEqual(projectDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockProjectDAO.update as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(projectId.toString(), { name: 'x' })).rejects.toThrow('DAO error');
  });
});
