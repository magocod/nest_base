import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

@Injectable()
export class WsLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('WS');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // console.log('Before...');
    // console.log(context.switchToWs().getClient().id);
    this.logger.debug('event socket: ' + context.switchToWs().getClient().id);
    // const now = Date.now();
    return next.handle();
    // .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
