import { Request, Response } from 'express';
import { Admin } from 'src/admin/entities';
import { ERole } from 'src/admin/types';
import { Address } from 'src/common/entities/address.entity';

export type TUser = {
  id: number;
  email: string;
  password: string;
};

export type TCodeVerificationReq = Request & {
  body: {
    code: string;
    rememberMe?: boolean;
  };
  session: TSession;
  user: TUser & { userId: number; userData: Admin };
};

export type TLoginReq = Request & {
  body: {
    rememberMe: boolean;
  };
  session: TSession;
  user: TUser & { userId: number; userData: Admin };
};

export type TLogoutReq = {
  session: {
    destroy: () => void;
  };
  ip: string;
};

export type TCookieRes = Response & {
  clearCookie: (name: string) => Response;
  cookie: (name: string, value: string, options: Parameters<Response['cookie']>[1]) => Response;
};

export type TSession = {
  cookie: {
    maxAge: number;
  };
  institutionId: number | undefined;
  rememberMe: boolean;
  validationCode: string;
  roles: ERole[];
};

export enum ECookieTTL {
  TTL30Days = 30 * 24 * 60 * 60 * 1000,
  TTL1Day = 24 * 60 * 60 * 1000,
  TTL10Mins = 10 * 60 * 1000,
}

export type TGetMeRes = {
  admin: Admin;
  onboardingCompleted: boolean;
  lang: string;
  address: Address;
};
