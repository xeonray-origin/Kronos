import { Task } from '@/entities';
import { IAction, IRequest } from '@/interfaces';
import { Response } from 'express';
import _ from 'lodash';

export default class TaskController {
  constructor(
    protected createTask: IAction<Task>,
    protected updateTask: IAction<Task>,
    protected deleteTask: IAction<string, boolean>,
  ) {}

  async create(request: IRequest): Promise<Task> {
    const { body: payload } = request;
    return this.createTask.call(payload);
  }

  async update(request: IRequest): Promise<Task> {
    const id = request.params?.id as string;
    const payload = request.body as Partial<Task>;
    return this.updateTask.call(id, payload);
  }

  async delete(request: IRequest): Promise<boolean> {
    const id = request.params?.id as string;
    return this.deleteTask.call(id);
  }
}
