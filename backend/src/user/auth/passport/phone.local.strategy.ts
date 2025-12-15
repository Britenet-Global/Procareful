import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TReqSession } from '../types';
import { TResponse, IUserWithModule } from '../../../common/types';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PhoneLocalStrategy extends PassportStrategy(Strategy, 'user-phone-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone', passwordField: 'pin', passReqToCallback: true });
  }
  async validate(
    req: TReqSession,
    phone: string,
    pin: string,
  ): Promise<IUserWithModule<TResponse<Omit<User, 'password'>> | Omit<User, 'password'>>> {
    const user = await this.authService.validateUser(req, pin, null, phone);
    return user;
  }
}
