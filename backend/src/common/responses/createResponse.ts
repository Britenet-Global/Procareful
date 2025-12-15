import { HttpStatus } from '@nestjs/common';
import { TResponse } from '../types';

export function createResponse<T>(
  httpStatus: HttpStatus,
  details: T | null,
  title?: string,
  message?: string,
  error?: string,
): TResponse<T> {
  return {
    status: httpStatus,
    notification: {
      title,
      message,
    },
    details,
    error,
  };
}
