import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

// export function loggerMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   console.log(`Request...`);
//   next();
// }

export function loggerMiddleware(logger: Logger) {
  return function (req: Request, res: Response, next: NextFunction) {
    // console.log(`Request...`);
    logger.debug(`${req.method} ${req.url} ${req.ip}`);
    next();
  };
}
