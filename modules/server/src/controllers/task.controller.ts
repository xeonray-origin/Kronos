import { Task } from '@/entities';
import { IAction, IRequest } from '@/interfaces';
import { Response } from 'express';
import _ from 'lodash';

export default class TaskController {
  constructor(protected createTask: IAction<Task>) {}

  async create(request: IRequest): Promise<Task> {
    const { body: payload } = request;
    return this.createTask.call(payload);
  }
}
