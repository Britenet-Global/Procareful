import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { Response } from 'express';
import { createResponse } from '../responses/createResponse';

type ExtendedQueryFailedError = QueryFailedError & {
  detail: string;
};

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: ExtendedQueryFailedError | EntityNotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let exceptionResponse: string;

    if (exception instanceof QueryFailedError) {
      status = HttpStatus.CONFLICT;
      exceptionResponse = exception.message;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      exceptionResponse = exception.message;
    }

    const customResponse = createResponse(
      status,
      null,
      'negative.common.typeorm_error.title',
      'negative.common.typeorm_error.message',
      exceptionResponse?.toString(),
    );

    response.status(status).json(customResponse);
  }
}

export class TypeORMExceptionFilterProvider {
  public provide = APP_FILTER;
  public useClass = TypeORMExceptionFilter;
}
