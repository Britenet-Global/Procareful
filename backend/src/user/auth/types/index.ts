import { Request, Response } from 'express';

export type TUser = {
  id: number;
  email?: string;
  phone: string;
  password: string;
};
export type TReqSession = Request & {
  session: {
    pin: string;
    institutionId: number | undefined;
    cookie: { maxAge: number };
    destroy: () => void;
  };
  user: TUser;
};
export type TResSession = Response & {
  req: {
    user: {
      status: number;
      notification: {
        title: string;
      };
    };
  };
};
export type TGeneratePin = {
  req: TReqSession;
  email?: string;
  phone?: string;
};

export enum ECookieTTL {
  TTL10Years = 10 * 365 * 24 * 60 * 60 * 1000,
  TTL2Hours = 2 * 60 * 60 * 1000,
}
