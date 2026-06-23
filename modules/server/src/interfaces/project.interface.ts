import { Project } from '@/entities';
import { Types } from 'mongoose';

export interface IProjectDAO {
  create: (project: Project) => Promise<Project>;
  update: (id: Types.ObjectId | string, project: Partial<Project>) => Promise<Project>;
  delete: (id: Types.ObjectId | string) => Promise<boolean>;
}
