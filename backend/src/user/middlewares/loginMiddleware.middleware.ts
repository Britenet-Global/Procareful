import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request & { user: { module: string }; session: { pin: string } }, res: Response, next: NextFunction): void {
    if (req.user?.module === 'Admin') {
      const pinFromSession = req.session.pin;

      return req.logout({}, () => {
        req.session.pin = pinFromSession;
        return next();
      });
    }
    if (req.user) {
      throw new BadRequestException('You are already logged in.');
    }
    next();
  }
}
