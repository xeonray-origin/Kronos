import ProjectController from '@/controllers/project.controller';
import { Project } from '@/entities';
import { IAction } from '@/interfaces';
import { Types } from 'mongoose';

const projectId = new Types.ObjectId();
const userId = new Types.ObjectId();
const projectDoc = { _id: projectId, name: 'My Project', userId } as Project;

describe('ProjectController', () => {
  let controller: ProjectController;
  let mockCreateProject: jest.Mocked<IAction<Project>>;
  let mockUpdateProject: jest.Mocked<IAction<Project>>;
  let mockDeleteProject: jest.Mocked<IAction<string, boolean>>;

  beforeEach(() => {
    mockCreateProject = { call: jest.fn() };
    mockUpdateProject = { call: jest.fn() };
    mockDeleteProject = { call: jest.fn() };
    controller = new ProjectController(mockCreateProject, mockUpdateProject, mockDeleteProject);
  });

  describe('create', () => {
    it('delegates to createProject action and returns the result', async () => {
      const body = { name: 'My Project', userId } as Project;
      mockCreateProject.call.mockResolvedValue(projectDoc);
      const result = await controller.create({ body });
      expect(mockCreateProject.call).toHaveBeenCalledWith(body);
      expect(result).toBe(projectDoc);
    });
  });

  describe('update', () => {
    it('delegates to updateProject action with id from params and body as payload', async () => {
      const body = { name: 'Renamed' };
      const id = projectId.toString();
      mockUpdateProject.call.mockResolvedValue(projectDoc);
      const result = await controller.update({ body, params: { id } });
      expect(mockUpdateProject.call).toHaveBeenCalledWith(id, body);
      expect(result).toBe(projectDoc);
    });
  });

  describe('delete', () => {
    it('delegates to deleteProject action with id from params', async () => {
      const id = projectId.toString();
      mockDeleteProject.call.mockResolvedValue(true);
      const result = await controller.delete({ params: { id } });
      expect(mockDeleteProject.call).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
