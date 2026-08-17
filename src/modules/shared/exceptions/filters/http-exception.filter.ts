import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  BusinessException,
  ValidationException,
} from '../exceptions';

/**
 * ★ Filtro global para todas las excepciones HTTP
 *
 * Captura TODAS las excepciones (Nest, dominio, y no manejadas)
 * y las convierte en respuestas HTTP estructuradas.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorCode: string;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      status = exception.getStatus();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message ||
            'Se produjo un error';
      errorCode = exception.constructor.name;
    } else if (exception instanceof DomainException) {
      status = this.mapDomainExceptionToHttpStatus(exception);
      message = exception.message;
      errorCode = exception.code || exception.constructor.name;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      errorCode = 'InternalServerError';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorCode = 'UnknownError';
    }

    const errorResponse = {
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private mapDomainExceptionToHttpStatus(exception: DomainException): number {
    if (exception instanceof BusinessException) {
      return HttpStatus.CONFLICT; // 409
    }
    if (exception instanceof ValidationException) {
      return HttpStatus.BAD_REQUEST; // 400
    }
    if (exception instanceof NotFoundException) {
      return HttpStatus.NOT_FOUND; // 404
    }
    return HttpStatus.INTERNAL_SERVER_ERROR; // 500
  }
}
