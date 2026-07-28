import { CreateTask, DeleteTask, GetUserTasks, UpdateTask } from '@/actions';
import { TaskController } from '@/controllers';
import { TaskDAO } from '@/dao';
import { Task } from '@/entities';
import { IValidator } from '@/interfaces';
import SessionMiddleware from '@/middlewares/session.middleware';
import { JWTToken, taskValidator } from '@/utils';
import express, { NextFunction, Request, Response, Router } from 'express';

const taskDAO = new TaskDAO();

const CreateTaskAction = new CreateTask(taskValidator as unknown as IValidator<Task>, taskDAO);
const UpdateTaskAction = new UpdateTask(taskDAO);
const DeleteTaskAction = new DeleteTask(taskDAO);
const GetUserTasksAction = new GetUserTasks(taskDAO);

const sessionMiddleware = new SessionMiddleware(new JWTToken());
const controller = new TaskController(
  CreateTaskAction,
  UpdateTaskAction,
  DeleteTaskAction,
  GetUserTasksAction,
);
const router: Router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  sessionMiddleware.handle(req, res, next),
);

router.get('/', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = response.locals.user.userId as string;
    const result = await controller.getByUser({ params: { userId } });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/create', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = { ...request.body, userId: response.locals.user.userId as string };
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
