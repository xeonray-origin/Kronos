import { CreateLabel, DeleteLabel, UpdateLabel } from '@/actions';
import { LabelController } from '@/controllers';
import { LabelDAO } from '@/dao';
import express, { NextFunction, Request, Response, Router } from 'express';

const labelDAO = new LabelDAO();

const CreateLabelAction = new CreateLabel(labelDAO);
const UpdateLabelAction = new UpdateLabel(labelDAO);
const DeleteLabelAction = new DeleteLabel(labelDAO);

const controller = new LabelController(CreateLabelAction, UpdateLabelAction, DeleteLabelAction);
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
