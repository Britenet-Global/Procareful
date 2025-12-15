import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { ECookieTTL, TGeneratePin, TReqSession } from './types';
import { generateVerificationCode, hashString } from '../../utils';
import { IUserWithModule, TResponse, EEventType } from '../../common/types';
import { createResponse } from '../../common/responses/createResponse';
import { EmailService } from '../../email/email.service';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EStatus } from 'src/admin/types';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TUserAuthResponseKey } from 'src/common/utils/translationKeys';
import { Status } from 'src/admin/entities';
import { RedisService } from '../../redis/redis.service';
import { EmailDto } from './dto';
import { Response } from 'express';
import { UserService } from '../user.service';
import { TGetLang } from '../types';
import { Logger } from '../../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    private readonly i18n: I18nService,

    private readonly redisService: RedisService,

    private readonly userService: UserService,

    private readonly loggerService: Logger,
  ) {}

  private readonly collectionName = 'pinCode';

  async isUserExist(email?: string, phone?: string, institution?: boolean): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        ...(email && { email_address: email }),
        ...(phone && { phone_number: phone }),
      },
      relations: institution ? ['status', 'institution', 'institution.workingHours'] : ['status'],
    });

    return user;
  }

  async generatePin({ req, email = '', phone = '' }: TGeneratePin): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const userExists = await this.isUserExist(email, phone);
    if (!userExists)
      return createResponse(
        HttpStatus.UNAUTHORIZED,
        null,
        this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.user_not_found.notification.message`, {
          lang,
        }),
      );

    if (userExists?.status?.status_name === EStatus.INACTIVE) {
      throw new UnauthorizedException();
    }

    const plainPin = generateVerificationCode();
    req.session.pin = await hashString(plainPin);
    req.session.cookie.maxAge = ECookieTTL.TTL2Hours;

    await this.redisService.saveItemToRedis(userExists.id, plainPin, this.collectionName, 7200);

    if (email) {
      await this.emailService.sendPinViaEmail(email, plainPin);
      return createResponse(
        HttpStatus.CREATED,
        null,
        this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.pin_sent_to_users_email.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.pin_sent_to_users_email.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.pin_sent_to_caregiver.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserAuthResponseKey}.service.GENERATE_PIN.pin_sent_to_caregiver.notification.message`, {
        lang,
      }),
    );
  }

  async validateUser(
    req: TReqSession,
    pin: string,
    email?: string,
    phone?: string,
  ): Promise<IUserWithModule<TResponse<Omit<User, 'password'>> | Omit<User, 'password'>>> {
    try {
      const lang = I18nContext.current().lang;

      const user = await this.isUserExist(email, phone, true);

      if (!user || user?.status?.status_name === EStatus.INACTIVE) {
        throw new UnauthorizedException();
      }

      const currentTime = new Date();

      if (user.lockout_until && currentTime < user.lockout_until) {
        const remainingTime = Math.ceil((user.lockout_until.getTime() - currentTime.getTime()) / 60000);

        throw new UnauthorizedException(
          this.i18n.t(`${TUserAuthResponseKey}.service.VALIDATE_USER.account_locked.notification.message`, {
            lang,
            args: {
              remainingTime,
              email: user.institution?.workingHours?.email,
              phone: user.institution?.workingHours?.phone,
            },
          }),
        );
      }

      const hashedPin = req.session.pin;

      if (!hashedPin) {
        throw new UnauthorizedException();
      }

      const isPinValid = await compare(pin, hashedPin);

      if (user && isPinValid) {
        user.failed_login_attempts = null;
        user.lockout_until = null;
        await this.userRepository.save(user);

        if (user?.status?.status_name !== EStatus.ACTIVE) {
          const active = await this.statusRepository.findOne({
            where: {
              status_name: EStatus.ACTIVE,
            },
          });

          user.status = active;
          await this.userRepository.save(user);
        }

        req.session.institutionId = user.institution.id;

        this.loggerService.log({
          event: EEventType.LOGIN_SUCCESS,
          timeStamp: new Date(),
          ip: req?.ip,
        });

        const sessionId = req?.sessionID;
        const institutionId = req?.session?.institutionId;
        if (sessionId && institutionId) {
          console.log({ sessionId, institutionId });
          await this.redisService.saveSessionInfo(institutionId, sessionId);
        }

        return { userData: user, module: 'User' };
      } else {
        if (user.lockout_until && currentTime >= user.lockout_until) {
          user.failed_login_attempts = null;
          user.lockout_until = null;
        }

        user.failed_login_attempts += 1;

        if (user.failed_login_attempts >= 5) {
          user.lockout_until = new Date(currentTime.getTime() + 20 * 60000);
          await this.userRepository.save(user);
          const remainingTime = Math.ceil((user.lockout_until.getTime() - currentTime.getTime()) / 60000);
          throw new UnauthorizedException(
            this.i18n.t(`${TUserAuthResponseKey}.service.VALIDATE_USER.account_locked.notification.message`, {
              lang,
              args: {
                remainingTime,
                email: user.institution?.workingHours?.email,
                phone: user.institution?.workingHours?.phone,
              },
            }),
          );
        }

        await this.userRepository.save(user);
        throw new UnauthorizedException();
      }
    } catch (err) {
      this.loggerService.log({
        event: EEventType.LOGIN_FAILED,
        timeStamp: new Date(),
        ip: req?.ip,
      });
      throw err;
    }
  }
  async setCookieMaxAge(req: TReqSession): Promise<void> {
    req.session.cookie.maxAge = ECookieTTL.TTL10Years;
  }

  async setCookieLang(res: Response, userId: number): Promise<void> {
    const { details } = (await this.userService.getLang(userId)) as TGetLang;
    res.cookie('lang', details.language.toLowerCase());
  }

  async logout(req: TReqSession): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    req.session.destroy();
    this.loggerService.log({
      event: EEventType.LOGOUT,
      timeStamp: new Date(),
      ip: req?.ip,
    });
    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TUserAuthResponseKey}.service.LOGOUT.logged_out.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserAuthResponseKey}.service.LOGOUT.logged_out.notification.message`, {
        lang,
      }),
    );
  }

  async resendPin(req: TReqSession, { email }: EmailDto): Promise<TResponse> {
    return await this.generatePin({ req, email });
  }
}
