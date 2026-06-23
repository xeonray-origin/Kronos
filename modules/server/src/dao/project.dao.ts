import { Project } from '@/entities';
import { Project as ProjectModel } from '@/models';
import { IProjectDAO } from '@/interfaces/project.interface';
import { Types } from 'mongoose';

export class ProjectDAO implements IProjectDAO {
  async create(project: Project): Promise<Project> {
    const created = await ProjectModel.create(project);
    return created as unknown as Project;
  }

  async update(id: Types.ObjectId | string, project: Partial<Project>): Promise<Project> {
    const updated = await ProjectModel.findByIdAndUpdate(id, project, { new: true });
    return updated as unknown as Project;
  }

  async delete(id: Types.ObjectId | string): Promise<boolean> {
    await ProjectModel.findByIdAndDelete(id);
    return true;
  }
}
