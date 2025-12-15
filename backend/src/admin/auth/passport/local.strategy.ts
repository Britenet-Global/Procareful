import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IUserWithModule, TResponse } from 'src/common/types';
import { TLoginReq } from '../types';
import { Admin } from 'src/admin/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'admin-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(
    req: TLoginReq,
    email: string,
    password: string,
  ): Promise<IUserWithModule<TResponse<Omit<Admin, 'password'>> | Omit<Admin, 'password'>>> {
    email = email.toLowerCase();
    return await this.authService.validateUser(req, email, password);
  }
}
