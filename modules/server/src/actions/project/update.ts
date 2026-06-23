import { Project } from '@/entities';
import { IAction, IProjectDAO } from '@/interfaces';

class UpdateProject implements IAction<Project> {
  constructor(protected projectDAO: IProjectDAO) {}

  async call(id: string, payload: Partial<Project>): Promise<Project> {
    return await this.projectDAO.update(id, payload);
  }
}

export default UpdateProject;
