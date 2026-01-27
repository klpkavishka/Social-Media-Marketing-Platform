import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = HttpStatus.BAD_REQUEST;
    let message = 'Database query failed';

    // Handle specific PostgreSQL errors
    const error: any = exception;
    if (error.code === '23505') {
      // Unique violation
      message = 'A record with this value already exists';
    } else if (error.code === '23503') {
      // Foreign key violation
      message = 'Related record does not exist';
    } else if (error.code === '23502') {
      // Not null violation
      message = 'Required field is missing';
    }

    this.logger.error(
      `Database Error: ${error.code} - ${error.detail || error.message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: 'DatabaseError',
    });
  }
}
