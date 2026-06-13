import { Application } from 'express';
import auth from './auth.route';
import task from './task.route';

export default {
  attach(app: Application): void {
    app.use('/auth', auth);
    app.use('/task', task);
  },
};
