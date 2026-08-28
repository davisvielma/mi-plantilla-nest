import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../exceptions';

/**
 * Filtro global para todas las excepciones HTTP
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
      errorCode = exception.name || exception.constructor.name;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Error Interno del Servidor';
      errorCode = 'InternalServerError';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error Interno del Servidor';
      errorCode = 'UnknownError';
    }

    const errorResponse = {
      statusCode: status,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private mapDomainExceptionToHttpStatus(exception: DomainException): number {
    const exceptionName = exception.name || exception.constructor.name;

    // Not found exceptions -> 404
    if (exceptionName.includes('NotFound')) {
      return HttpStatus.NOT_FOUND;
    }

    // Access denied exceptions -> 403
    if (
      exceptionName.includes('AccessDenied') ||
      exceptionName.includes('Forbidden') ||
      exceptionName.includes('Unauthorized')
    ) {
      return HttpStatus.FORBIDDEN;
    }

    // Already exists / conflict / constraint exceptions -> 409
    if (
      exceptionName.includes('Duplicate') ||
      exceptionName.includes('Conflict') ||
      exceptionName.includes('Deleted')
    ) {
      return HttpStatus.CONFLICT;
    }

    // Invalid data / validation exceptions -> 400
    if (
      exceptionName.includes('Invalid') ||
      exceptionName.includes('RequiredField') ||
      exceptionName.includes('Validation')
    ) {
      return HttpStatus.BAD_REQUEST;
    }

    // Default for domain exceptions -> 400 (client error)
    return HttpStatus.BAD_REQUEST;
  }
}
