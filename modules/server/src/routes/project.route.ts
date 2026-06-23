import { CreateProject, DeleteProject, UpdateProject } from '@/actions';
import { ProjectController } from '@/controllers';
import { ProjectDAO } from '@/dao';
import express, { NextFunction, Request, Response, Router } from 'express';

const projectDAO = new ProjectDAO();

const CreateProjectAction = new CreateProject(projectDAO);
const UpdateProjectAction = new UpdateProject(projectDAO);
const DeleteProjectAction = new DeleteProject(projectDAO);

const controller = new ProjectController(
  CreateProjectAction,
  UpdateProjectAction,
  DeleteProjectAction,
);
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
