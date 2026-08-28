import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interfaz para la estructura de respuesta uniforme
 */
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
}

/**
 * Interceptor para estandarizar todas las respuestas exitosas
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data: T) => ({
        data,
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      })),
    );
  }
}
