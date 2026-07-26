import express, { Router } from 'express';
import auth from './auth.route';
import task from './task.route';
import label from './label.route';

export default {
  attach(): Router {
    const router = express.Router();
    router.use('/auth', auth);
    router.use('/task', task);
    router.use('/label', label);
    return router;
  },
};
