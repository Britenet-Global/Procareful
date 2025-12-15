import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TReqSession } from '../types';
import { TResponse, IUserWithModule } from '../../../common/types';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmailLocalStrategy extends PassportStrategy(Strategy, 'user-email-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'pin', passReqToCallback: true });
  }
  async validate(
    req: TReqSession,
    email: string,
    pin: string,
  ): Promise<IUserWithModule<TResponse<Omit<User, 'password'>> | Omit<User, 'password'>>> {
    return await this.authService.validateUser(req, pin, email);
  }
}
