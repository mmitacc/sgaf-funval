import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const startTime = Date.now();
    let date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    // console.log(`[${date}] - [${method}] - [${url}] - [latency: 0 ms]`);
    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          this.logger.log(
            `[${date}] - [${method}] - [${url}] - [latency: ${responseTime} ms]`,
          );
        },
        error: (err) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `[${date}] - [${method}] - [${url}] - [latency: ${responseTime} ms] - ${err.message}`,
          );
        },
      }),
    );
  }
}
