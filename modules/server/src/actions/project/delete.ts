import { IAction, IProjectDAO } from '@/interfaces';

class DeleteProject implements IAction<string, boolean> {
  constructor(protected projectDAO: IProjectDAO) {}

  async call(id: string): Promise<boolean> {
    return await this.projectDAO.delete(id);
  }
}

export default DeleteProject;
