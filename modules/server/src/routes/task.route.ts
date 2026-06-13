import { CreateTask } from '@/actions';
import { TaskController } from '@/controllers';
import { TaskDAO } from '@/dao';
import express, { NextFunction, Request, Response, Router } from 'express';

const taskDAO = new TaskDAO();

const CreateTaskAction = new CreateTask(taskDAO);

const controller = new TaskController(CreateTaskAction);
const router: Router = express.Router();

router.post('/create', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const result = await controller.create({ body });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
