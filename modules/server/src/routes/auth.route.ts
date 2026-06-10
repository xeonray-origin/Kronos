import { RegisterUser } from '@/actions';
import { services } from '@/config';
import AuthController from '@/controllers/auth.controller';
import { UserDAO } from '@/dao';
import { AuthUser, User } from '@/entities';
import { IValidator } from '@/interfaces';
import { userValidator } from '@/utils';
import express, { NextFunction, Request, Response, Router } from 'express';

const userDAO = new services.auth.DAO();
const validator = services.auth.validator as unknown as IValidator<AuthUser>;

const RegisterUserAction = new RegisterUser(validator, userDAO, async (password: string) =>
  Promise.resolve({ password, salt: '' }),
);

const controller = new AuthController(RegisterUserAction);
const router: Router = express.Router();

router.post('/register', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const result = await controller.register({ body });
    response.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
