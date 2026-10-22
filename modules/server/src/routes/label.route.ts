import { CreateLabel, DeleteLabel, UpdateLabel } from '@/actions';
import { LabelController } from '@/controllers';
import { LabelDAO } from '@/dao';
import { Label } from '@/entities';
import { IValidator } from '@/interfaces';
import SessionMiddleware from '@/middlewares/session.middleware';
import { JWTToken, labelUpdateValidator } from '@/utils';
import express, { NextFunction, Request, Response, Router } from 'express';

const labelDAO = new LabelDAO();

const CreateLabelAction = new CreateLabel(labelDAO);
const UpdateLabelAction = new UpdateLabel(
  labelUpdateValidator as unknown as IValidator<Label>,
  labelDAO,
);
const DeleteLabelAction = new DeleteLabel(labelDAO);

const sessionMiddleware = new SessionMiddleware(new JWTToken());
const controller = new LabelController(CreateLabelAction, UpdateLabelAction, DeleteLabelAction);
const router: Router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  sessionMiddleware.handle(req, res, next),
);

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
      params: {
        id: request.params.id as string,
        userId: response.locals.user.userId as string,
      },
    });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/delete/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await controller.delete({
      params: {
        id: request.params.id as string,
        userId: response.locals.user.userId as string,
      },
    });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
