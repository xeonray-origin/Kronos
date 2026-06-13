import { ValidationError } from '@/errors';
import { IJwtToken } from '@/interfaces';
import { NextFunction, Request, Response } from 'express';

export default class SessionMiddleware {
  constructor(private jwtToken: IJwtToken) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new ValidationError('Unauthorized !', undefined, 401);
      }
      const token = authHeader.slice(7);
      const payload = await this.jwtToken.verifyToken(token);
      if (!payload) {
        throw new ValidationError('Unauthorized !', undefined, 401);
      }
      res.locals.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  }
}
