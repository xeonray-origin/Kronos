import CreateProject from '@/actions/project/create';
import { Project } from '@/entities';
import { IProjectDAO } from '@/interfaces';
import { Types } from 'mongoose';

const projectId = new Types.ObjectId();
const userId = new Types.ObjectId();
const projectInput = { name: 'My Project', userId } as Project;
const projectDoc = { _id: projectId, ...projectInput } as Project;

const mockProjectDAO: IProjectDAO = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateProject', () => {
  let action: CreateProject;

  beforeEach(() => {
    action = new CreateProject(mockProjectDAO);
    jest.clearAllMocks();
  });

  it('delegates to projectDAO.create and returns the result', async () => {
    (mockProjectDAO.create as jest.Mock).mockResolvedValueOnce(projectDoc);
    const result = await action.call(projectInput);
    expect(mockProjectDAO.create).toHaveBeenCalledWith(projectInput);
    expect(result).toEqual(projectDoc);
  });

  it('propagates errors from the DAO', async () => {
    (mockProjectDAO.create as jest.Mock).mockRejectedValueOnce(new Error('DAO error'));
    await expect(action.call(projectInput)).rejects.toThrow('DAO error');
  });
});
