import { Request } from 'express';

export type TRequest = Request & {
  session: {
    institutionId: number | undefined;
  };
};

type TDetails = {
  field: string;
  error: string;
};

export type TResponseDetails = TArrayResponse<string> | TDetails[] | null;

export enum ESortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum EThrottleTtlInMiliSeconds {
  ONE_MINUTE = 60000,
}

export enum EThrottleLimits {
  SIXTY = 60,
}

export type TResponse<T = null> = {
  status: number;
  notification: TNotification;
  details: TArrayResponse<T> | T | T[] | TValidationErrorsKeys | null;
  error?: string;
};

type TNotification = {
  title?: string;
  message?: string;
};

export type TArrayResponse<T> = {
  pagination: {
    pageSize: number;
    total: number;
    current: number;
  };
  sort: {
    field: string;
    sortOrder: ESortOrder;
  };
  filter: {
    field: string;
    filterValue: string;
  };
  search: {
    field: string;
  };
  items: T[];
};

export type TValidationErrorsKeys = Record<string, string[] | Record<string, string[]>>;
export type ValidationAccType = {
  keys: string[];
  constraints: Record<string, string[]>;
};

export enum EWeekdays {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export type TUserReq = Request & {
  user: {
    userId: number;
  };
};

export type TUserEmailReq = Request & {
  user: {
    userData: {
      email_address: string;
    };
  };
};

export interface IUserWithModule<User> {
  userData: User;
  module: 'Admin' | 'User';
}

export enum TControllerType {
  INSTITUTION = 'institution',
  CAREGIVER = 'caregiver',
}

export enum EInitiationPeriod {
  FORTY_TWO_DAYS = 42,
}

export enum EEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  VALIDATE_CODE_SUCCESS = 'VALIDATE_CODE_SUCCESS',
  VALIDATE_CODE_FAILED = 'VALIDATE_CODE_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
}
