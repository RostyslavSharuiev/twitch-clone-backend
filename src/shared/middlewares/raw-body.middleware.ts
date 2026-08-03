import {
  BadRequestException,
  Injectable,
  type NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { getRawBody } from 'raw-body';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(req: Request, _res: Response, next: NextFunction) {
    if (!req.readable) {
      return next(new BadRequestException('Invalid request'));
    }

    getRawBody(req, { encoding: 'utf-8' })
      .then((rawBody) => {
        req.body = rawBody;
        next();
      })
      .catch((error: unknown) => {
        throw new BadRequestException(
          'Receive error',
          error instanceof Error ? error.message : String(error)
        );
      });
  }
}
