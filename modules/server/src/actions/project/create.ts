import { Project } from '@/entities';
import { IAction, IProjectDAO } from '@/interfaces';

class CreateProject implements IAction<Project> {
  constructor(protected projectDAO: IProjectDAO) {}

  async call(payload: Project): Promise<Project> {
    return await this.projectDAO.create(payload);
  }
}

export default CreateProject;
