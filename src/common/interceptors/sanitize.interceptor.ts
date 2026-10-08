import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_SANITIZE_KEY } from '../decorators/skip-sanitize.decorator.js';

export const REMOVED_FIELDS = [
  'password',
  'updated',
  'deleted',
  'deletedate',
  'clientSecret',
];

export const MASKED_FIELDS = ['creditCard'];

export function maskCreditCard(value: string): string {
  return '**** **** **** ' + value.slice(-4);
}

export function sanitize(value: unknown): unknown {
  if (!value) return value;
  if (Array.isArray(value)) return value.map(sanitize);
  if (value instanceof Date) return value;
  if ((value as any).d) return (value = Number(value));
  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    const newObject: Record<string, any> = {};
    for (const [llave, valor] of Object.entries(value)) {
      if (REMOVED_FIELDS.includes(llave)) continue;
      if (MASKED_FIELDS.includes(llave)) {
        newObject[llave] = maskCreditCard(valor);
      } else {
        newObject[llave] = sanitize(valor);
      }
    }
    value = newObject;
    return value;
  }
  return value;
}

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipSanitize = this.reflector.getAllAndOverride<boolean>(
      SKIP_SANITIZE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Flag para saltar este interceptor con nuestro decorador @SkipSanitize()
    if (skipSanitize) return next.handle();

    return next.handle().pipe(map((data) => sanitize(data)));
  }
}
