import { Types } from 'mongoose';
import { ProjectDAO } from '@/dao/project.dao';
import { Project as ProjectModel } from '@/models';

jest.mock('@/models', () => ({
  Project: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockCreate = ProjectModel.create as jest.Mock;
const mockFindByIdAndUpdate = ProjectModel.findByIdAndUpdate as jest.Mock;
const mockFindByIdAndDelete = ProjectModel.findByIdAndDelete as jest.Mock;

describe('ProjectDAO', () => {
  let dao: ProjectDAO;
  const userId = new Types.ObjectId();
  const projectId = new Types.ObjectId();
  const projectInput = { name: 'My Project', userId } as any;
  const projectDoc = { _id: projectId, ...projectInput };

  beforeEach(() => {
    dao = new ProjectDAO();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns the created project document', async () => {
      mockCreate.mockResolvedValueOnce(projectDoc);
      const result = await dao.create(projectInput);
      expect(mockCreate).toHaveBeenCalledWith(projectInput);
      expect(result).toEqual(projectDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockCreate.mockRejectedValueOnce(new Error('DB write failed'));
      await expect(dao.create(projectInput)).rejects.toThrow('DB write failed');
    });
  });

  describe('update', () => {
    it('returns the updated project document', async () => {
      const updatedDoc = { _id: projectId, ...projectInput, name: 'Renamed' };
      mockFindByIdAndUpdate.mockResolvedValueOnce(updatedDoc);
      const result = await dao.update(projectId, { name: 'Renamed' });
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        projectId,
        { name: 'Renamed' },
        { new: true },
      );
      expect(result).toEqual(updatedDoc);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndUpdate.mockRejectedValueOnce(new Error('DB update failed'));
      await expect(dao.update(projectId, { name: 'x' })).rejects.toThrow('DB update failed');
    });
  });

  describe('delete', () => {
    it('returns true after deleting the document', async () => {
      mockFindByIdAndDelete.mockResolvedValueOnce(null);
      const result = await dao.delete(projectId);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(projectId);
      expect(result).toBe(true);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindByIdAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));
      await expect(dao.delete(projectId)).rejects.toThrow('DB delete failed');
    });
  });
});
