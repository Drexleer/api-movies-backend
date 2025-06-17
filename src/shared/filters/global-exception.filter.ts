import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] = [];

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as ErrorResponse;

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (responseBody && typeof responseBody === 'object') {
        message = (responseBody.message as string) || message;
        if (Array.isArray(responseBody.message)) {
          errors = responseBody.message;
        } else {
          errors = [message];
        }
      }
    }
    // Handle TypeORM query errors
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database operation failed';

      // Handle specific database errors
      const error = exception as DatabaseError;
      if (error.code === '23505') {
        // Unique constraint violation
        message = 'Resource already exists';
        errors = ['A record with this data already exists'];
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        message = 'Referenced resource not found';
        errors = ['The referenced resource does not exist'];
      } else if (error.code === '23502') {
        // Not null constraint violation
        message = 'Required field missing';
        errors = ['A required field is missing'];
      } else {
        errors = [error.message || 'Database constraint violation'];
      }
    }
    // Handle unexpected errors
    else {
      const error = exception as Error;
      message = 'Internal server error';
      errors = [error.message || 'An unexpected error occurred'];

      // Log unexpected errors for debugging
      this.logger.error(
        `Unexpected error: ${error.message}`,
        error.stack,
        `${request.method} ${request.url}`,
      );
    }

    // Log all errors except validation errors (400) and not found (404)
    if (
      status >= HttpStatus.INTERNAL_SERVER_ERROR ||
      (status !== HttpStatus.BAD_REQUEST && status !== HttpStatus.NOT_FOUND)
    ) {
      this.logger.error(
        `HTTP ${status} Error: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        `${request.method} ${request.url}`,
      );
    }

    // Send error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      errors: errors.length > 0 ? errors : undefined,
    };

    response.status(status).json(errorResponse);
  }
}
