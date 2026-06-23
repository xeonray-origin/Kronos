import { Project } from '@/entities';
import { IAction, IRequest } from '@/interfaces';

export default class ProjectController {
  constructor(
    protected createProject: IAction<Project>,
    protected updateProject: IAction<Project>,
    protected deleteProject: IAction<string, boolean>,
  ) {}

  async create(request: IRequest): Promise<Project> {
    const { body: payload } = request;
    return this.createProject.call(payload);
  }

  async update(request: IRequest): Promise<Project> {
    const id = request.params?.id as string;
    const payload = request.body as Partial<Project>;
    return this.updateProject.call(id, payload);
  }

  async delete(request: IRequest): Promise<boolean> {
    const id = request.params?.id as string;
    return this.deleteProject.call(id);
  }
}
