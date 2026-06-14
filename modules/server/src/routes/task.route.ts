import { CreateTask, DeleteTask, UpdateTask } from '@/actions';
import { TaskController } from '@/controllers';
import { TaskDAO } from '@/dao';
import express, { NextFunction, Request, Response, Router } from 'express';

const taskDAO = new TaskDAO();

const CreateTaskAction = new CreateTask(taskDAO);
const UpdateTaskAction = new UpdateTask(taskDAO);
const DeleteTaskAction = new DeleteTask(taskDAO);

const controller = new TaskController(CreateTaskAction, UpdateTaskAction, DeleteTaskAction);
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

router.put('/update/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await controller.update({
      body: request.body,
      params: { id: request.params.id as string },
    });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/delete/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await controller.delete({
      params: { id: request.params.id as string },
    });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
