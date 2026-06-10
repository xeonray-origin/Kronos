import { Application } from 'express';
import auth from './auth.route';

export default {
  attach(app: Application): void {
    app.use('/auth', auth);
  },
};
