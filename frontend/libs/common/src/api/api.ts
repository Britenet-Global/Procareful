import { type AxiosError } from 'axios';
import type { BadRequestDto, NotificationDto } from '@Procareful/common/api';

export type ErrorType<Error> = AxiosError<Error>;
export type ErrorDetails = Record<string, string[]>;

export type ErrorResponse = ErrorType<
  BadRequestDto & {
    status: number;
    notification: NotificationDto;
  } & {
    details: ErrorDetails;
  }
>;
