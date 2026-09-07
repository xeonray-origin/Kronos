import { Task } from '@/entities';
import { IAction, IRequest, ITaskTimeInput } from '@/interfaces';
export default class TaskController {
  constructor(
    protected createTask: IAction<Task>,
    protected updateTask: IAction<Task>,
    protected deleteTask: IAction<string, boolean>,
    protected getUserTasks: IAction<string, Task[]>,
    protected logTaskTime: IAction<Task>,
  ) {}

  async create(request: IRequest): Promise<Task> {
    const { body: payload } = request;
    return this.createTask.call(payload);
  }

  async update(request: IRequest): Promise<Task> {
    const id = request.params?.id as string;
    const userId = request.params?.userId as string;
    const payload = request.body as Partial<Task>;
    return this.updateTask.call(id, userId, payload);
  }

  async delete(request: IRequest): Promise<boolean> {
    const id = request.params?.id as string;
    const userId = request.params?.userId as string;
    return this.deleteTask.call(id, userId);
  }

  async getByUser(request: IRequest): Promise<Task[]> {
    const userId = request.params?.userId as string;
    return this.getUserTasks.call(userId);
  }

  async logTime(request: IRequest): Promise<Task> {
    const id = request.params?.id as string;
    const userId = request.params?.userId as string;
    const payload = request.body as Partial<ITaskTimeInput>;
    return this.logTaskTime.call(id, userId, payload);
  }
}
