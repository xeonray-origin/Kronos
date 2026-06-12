import { RegisterUser, LoginUser } from '@/actions';
import { services } from '@/config';
import AuthController from '@/controllers/auth.controller';
import SessionDAO from '@/dao/session.dao';
import { AuthUser } from '@/entities';
import { IValidator } from '@/interfaces';
import { Hash, userValidator, loginValidator, JWTToken } from '@/utils';
import express, { NextFunction, Request, Response, Router } from 'express';

const userDAO = new services.auth.DAO();
const sessionDAO = new SessionDAO();
const validator = services.auth.validator as unknown as IValidator<AuthUser>;
const cryptoHash = new Hash('sha256', 8);
const jwtToken = new JWTToken();

const RegisterUserAction = new RegisterUser(
  validator,
  userDAO,
  cryptoHash.hashPassword.bind(cryptoHash),
);

const LoginUserAction = new LoginUser(
  loginValidator as unknown as IValidator<AuthUser>,
  userDAO,
  sessionDAO,
  cryptoHash.verifyPassword.bind(cryptoHash),
  jwtToken,
);

const controller = new AuthController(RegisterUserAction, LoginUserAction);
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

router.post('/login', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const result = await controller.login({ body });
    response.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
