import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { IUserWithModule, TArrayResponse, TResponse, TValidationErrorsKeys, EEventType } from 'src/common/types';
import { generateKey, generateVerificationCode, hashString } from 'src/utils';
import { Repository } from 'typeorm';
import { createResponse } from '../../common/responses/createResponse';
import { EmailService } from '../../email/email.service';
import { RedisService } from '../../redis/redis.service';
import { AdminService } from '../admin.service';
import { ChangePasswordDto, VerifySignupCredentialsDto } from '../dto';
import { Admin, Institution, Onboarding, Status } from '../entities';
import { ERole, EStatus } from '../types';
import { LoginDto, SignupDto } from './dto';
import { ECookieTTL, TCodeVerificationReq, TGetMeRes, TLoginReq, TLogoutReq } from './types';
import { Address } from 'src/common/entities/address.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TAdminAuthResponseKey, TCommonResponseKey } from '../../common/utils/translationKeys';
import { Logger } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly adminService: AdminService,
    private readonly i18n: I18nService,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,

    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,

    private readonly configService: ConfigService,

    private readonly loggerService: Logger,
  ) {}

  private readonly collectionName = 'tokens';
  private readonly collectionNamePassword = 'confirmPassword';

  async saveNewPasswordToDb(
    adminRepository: Repository<Admin>,
    id: number,
    password: string,
  ): Promise<TResponse<void>> {
    const lang = I18nContext.current().lang;
    const user = await adminRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.SAVE_NEW_PASSWORD_TO_DB.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.SAVE_NEW_PASSWORD_TO_DB.not_found.notification.message`, {
          lang,
        }),
      );
    }

    user.password = password;
    await adminRepository.update(id, user);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.SAVE_NEW_PASSWORD_TO_DB.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.SAVE_NEW_PASSWORD_TO_DB.success.notification.message`, {
        lang,
      }),
    );
  }

  async validateUser(
    req: TLoginReq,
    email: string,
    password: string,
  ): Promise<IUserWithModule<TResponse<Omit<Admin, 'password'>> | Omit<Admin, 'password'>>> {
    try {
      const user = await this.adminRepository
        .createQueryBuilder('admin')
        .leftJoinAndSelect('admin.status', 'status')
        .leftJoin('admin.institution', 'institution')
        .where('admin.email_address = :email', { email })
        .addSelect(['admin.password', 'institution.id'])
        .getOne();

      if (!user) {
        throw new BadRequestException();
      }

      if (user.status.status_name === EStatus.INACTIVE) {
        throw new UnauthorizedException();
      }

      if (user) {
        const passwordMatch = await compare(password, user.password);

        if (passwordMatch) {
          delete user.password;

          req.session.institutionId = user?.institution?.id;

          this.loggerService.log({
            event: EEventType.LOGIN_SUCCESS,
            timeStamp: new Date(),
            ip: req?.ip,
          });
          return { userData: user, module: 'Admin' };
        }

        throw new UnauthorizedException();
      }

      throw new UnauthorizedException();
    } catch (err) {
      this.loggerService.log({
        event: EEventType.LOGIN_FAILED,
        timeStamp: new Date(),
        ip: req?.ip,
      });
      throw err;
    }
  }

  async handleLogin(loginDto: LoginDto, req: TLoginReq): Promise<TResponse<string>> {
    const lang = I18nContext.current().lang;
    const rememberMe = req.session.rememberMe;

    const sessionId = req?.sessionID;
    const institutionId = req?.user?.userData?.institution?.id;
    if (sessionId && institutionId) {
      await this.redisService.saveSessionInfo(institutionId, sessionId);
    }

    if (!rememberMe) {
      req.session.cookie.maxAge = ECookieTTL.TTL10Mins;

      const validationCode = generateVerificationCode();
      const hashedValidationCode = await hashString(validationCode);
      const email = loginDto.email;
      const admin = await this.adminRepository.findOne({
        where: {
          email_address: email,
        },
        select: ['first_name', 'last_name'],
      });

      req.session.validationCode = hashedValidationCode;

      await this.emailService.sendVerificationEmail(
        email,
        validationCode,
        `${admin?.first_name || ''} ${admin?.last_name || ''}`,
      );

      return createResponse(
        HttpStatus.CREATED,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.code_sent.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.code_sent.notification.message`, {
          lang,
        }),
      );
    }

    req.session.cookie.maxAge = ECookieTTL.TTL30Days;
    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.logged_in.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.logged_in.notification.message`, {
        lang,
      }),
    );
  }

  async handleResendVerificationCode(req: TCodeVerificationReq): Promise<TResponse<string>> {
    const lang = I18nContext.current().lang;

    if (!req.user?.userData) {
      return createResponse(
        HttpStatus.UNAUTHORIZED,
        null,
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.not_authenticated.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.not_authenticated.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const validationCode = generateVerificationCode();
    const hashedValidationCode = await hashString(validationCode);
    const { email_address, first_name, last_name } = req.user.userData;
    req.session.validationCode = hashedValidationCode;

    await this.emailService.sendVerificationEmail(
      email_address,
      validationCode,
      `${first_name || ''} ${last_name || ''}`,
    );

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.code_sent.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.HANDLE_LOGIN.code_sent.notification.message`, {
        lang,
      }),
    );
  }

  async validateVerificationCode(
    req: TCodeVerificationReq,
    code: string,
    rememberMe: boolean,
  ): Promise<TResponse<TGetMeRes | TValidationErrorsKeys | TArrayResponse<TGetMeRes> | TGetMeRes[]>> {
    const lang = I18nContext.current().lang;
    const validationCodeFromSession = req.session.validationCode;

    if (!validationCodeFromSession) {
      this.loggerService.log({
        event: EEventType.VALIDATE_CODE_FAILED,
        timeStamp: new Date(),
        ip: req?.ip,
      });
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.code_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.code_not_found.notification.message`, {
          lang,
        }),
      );
    }
    if (!req.user || !req.user.userId || !req.session) {
      this.loggerService.log({
        event: EEventType.VALIDATE_CODE_FAILED,
        timeStamp: new Date(),
        ip: req?.ip,
      });
      return createResponse(
        HttpStatus.UNAUTHORIZED,
        null,
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.not_authenticated.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.not_authenticated.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const codesMatch = await compare(code, validationCodeFromSession);
    const user = (await this.getMe(req.user)).details;

    if (user && codesMatch) {
      req.session.cookie.maxAge = ECookieTTL.TTL1Day;

      if (rememberMe) {
        req.session.rememberMe = true;
        req.session.cookie.maxAge = ECookieTTL.TTL30Days;
      }

      req.session.rememberMe = false;
      delete req.session.validationCode;

      const adminId = (user as unknown as { admin: Admin }).admin.id;
      const admin = await this.adminRepository.findOne({
        where: {
          id: adminId,
        },
      });

      admin.first_login = true;

      await this.adminRepository.save(admin);

      this.loggerService.log({
        event: EEventType.VALIDATE_CODE_SUCCESS,
        timeStamp: new Date(),
        ip: req?.ip,
      });

      return createResponse(
        HttpStatus.CREATED,
        user,
        this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.success.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.success.notification.message`, {
          lang,
        }),
      );
    }

    this.loggerService.log({
      event: EEventType.VALIDATE_CODE_FAILED,
      timeStamp: new Date(),
      ip: req?.ip,
    });

    return createResponse(
      HttpStatus.UNAUTHORIZED,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.failure.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.VALIDATE_VERIFICATION_CODE.failure.notification.message`, {
        lang,
      }),
    );
  }

  async logout(req: TLogoutReq): Promise<TResponse<string>> {
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
      this.i18n.t(`${TAdminAuthResponseKey}.service.LOGOUT.logged_out.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.LOGOUT.logged_out.notification.message`, {
        lang,
      }),
    );
  }

  async sendForgotPasswordEmail<T>(email: string, req: TLoginReq): Promise<TResponse<T>> {
    const lang = I18nContext.current().lang;
    const existingUser = await this.adminRepository.findOne({
      where: {
        email_address: email,
      },
    });

    if (existingUser) {
      const linkId = generateKey();
      await this.redisService.saveLinkIdToRedis(linkId, existingUser.id, +process.env.PRC_RESET_LINK_ID_TTL);
      const generatedResetLink = `${this.configService.get('domain')}/reset-password?id=${linkId}`;
      await this.emailService.sendResetEmail(email, generatedResetLink);
    }

    this.loggerService.log({
      event: EEventType.PASSWORD_RESET_REQUEST,
      timeStamp: new Date(),
      ip: req?.ip,
    });

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.SEND_FORGOT_PASSWORD_EMAIL.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.SEND_FORGOT_PASSWORD_EMAIL.success.notification.message`, {
        lang,
      }),
    );
  }

  async resetAdminPassword(newPassword: string, linkId: string, req: TLogoutReq): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const userId = await this.redisService.getUserIdByLinkIdFromRedis(linkId);

    if (!userId) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.forbidden.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.forbidden.notification.message`, {
          lang,
        }),
      );
    }

    const user = await this.adminRepository.findOne({
      where: {
        id: +userId,
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const hashedPassword = await hashString(newPassword);

    await this.saveNewPasswordToDb(this.adminRepository, user.id, hashedPassword);

    await this.redisService.removeLinkFromRedis(linkId);
    req.session.destroy();

    this.loggerService.log({
      event: EEventType.PASSWORD_CHANGE,
      timeStamp: new Date(),
      ip: req?.ip,
    });

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.success.notification.message`, {
        lang,
      }),
    );
  }

  async signup({ email, password, phone, token }: SignupDto): Promise<TResponse<string>> {
    const lang = I18nContext.current().lang;
    const result = await this.verifySignupCredentials({ email_address: email, phone_number: phone, token });

    if (result.status !== HttpStatus.NO_CONTENT) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.invalid_credentials.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.invalid_credentials.notification.message`, {
          lang,
        }),
      );
    }

    const user = await this.adminService.findOneByFields({ email_address: email, phone_number: phone });
    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.user_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const userStatus = user.status.status_name;
    if (!(userStatus === EStatus.CREATED)) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.already_active.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.already_active.notification.message`, {
          lang,
        }),
      );
    }

    user.password = await hashString(password);

    const status = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.ACTIVE,
      },
    });

    if (!status) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.status_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.SIGNUP.status_not_found.notification.message`, {
          lang,
        }),
      );
    }

    user.status = status;

    const institution = await this.institutionRepository.findOne({
      where: {
        admins: {
          id: user.id,
        },
      },
      relations: ['status'],
    });

    const hasSuperInstitutionAdminRole = user.roles.some((role) => role.role_name === ERole.SUPER_ADMIN_INSTITUTION);

    if (hasSuperInstitutionAdminRole && institution?.status?.status_name === EStatus.CREATED) {
      institution.status = status;
      await this.institutionRepository.save(institution);
    }

    await this.adminRepository.save(user);
    await this.redisService.removeItemFromRedis(email, 'tokens');

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.RESET_ADMIN_PASSWORD.success.notification.message`, {
        lang,
      }),
    );
  }

  async getMe(userDetails: { userData: Admin }): Promise<TResponse<TGetMeRes>> {
    const lang = I18nContext.current().lang;
    const admin = await this.adminRepository.findOne({
      where: {
        id: userDetails.userData.id,
      },
      relations: ['country'],
    });
    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id: userDetails.userData.id,
        },
      },
    });
    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id: userDetails.userData.id,
        },
      },
    });

    const result = {
      admin: userDetails.userData,
      onboardingCompleted: !onboarding,
      lang: admin.country.country_code,
      address,
    };

    return createResponse(
      HttpStatus.OK,
      result,
      this.i18n.t(`${TAdminAuthResponseKey}.service.GET_ME.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.GET_ME.success.notification.message`, {
        lang,
      }),
    );
  }

  async verifySignupCredentials({
    email_address,
    phone_number,
    token,
  }: VerifySignupCredentialsDto): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const tokenFromRedis = await this.redisService.getItemFromRedis(email_address, this.collectionName);
    if (!tokenFromRedis) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const tokensMatch = await compare(token, tokenFromRedis);

    if (!tokensMatch) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const admin = await this.adminRepository.findOne({
      where: { email_address, phone_number },
    });

    if (!admin) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.invalid_credentials.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.NO_CONTENT,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.VERIFY_SIGNUP_CREDENTIALS.success.notification.message`, {
        lang,
      }),
    );
  }

  async changePassword(
    adminId: number,
    { currentPassword, newPassword, confirmNewPassword }: ChangePasswordDto,
  ): Promise<TResponse<null | { currentPassword: string[] }>> {
    const lang = I18nContext.current().lang;

    const admin = await this.adminRepository.findOne({
      where: {
        id: adminId,
      },
      select: ['password', 'email_address'],
    });

    const passwordsMatch = await compare(currentPassword, admin.password);

    if (!passwordsMatch) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        {
          currentPassword: [
            this.i18n.t(
              `${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.current_password_mismatch.notification.message`,
              { lang },
            ),
          ],
        },
        this.i18n.t('translation.notification.negative.common.validation.title', {
          lang,
        }),
        this.i18n.t('translation.notification.negative.common.validation.message', {
          lang,
        }),
        'Bad Request',
      );
    }

    if (currentPassword === newPassword) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.same_as_current.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.same_as_current.notification.message`, {
          lang,
        }),
      );
    }

    if (newPassword !== confirmNewPassword) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.new_password_mismatch.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.new_password_mismatch.notification.message`, {
          lang,
        }),
      );
    }

    const hashedPassword = await hashString(newPassword);
    admin.password = hashedPassword;

    await this.adminRepository.update(adminId, admin);
    await this.emailService.sendPasswordChangeConfirmationEmail(admin.email_address);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD.success.notification.message`, {
        lang,
      }),
    );
  }

  async changePasswordConfirm(linkId: string, req: TLogoutReq): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const dataFromRedis = await this.redisService.getItemFromRedis(linkId, this.collectionNamePassword);

    if (!dataFromRedis) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD_CONFIRM.forbidden.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD_CONFIRM.forbidden.notification.message`, {
          lang,
        }),
      );
    }

    const { email_address, password } = JSON.parse(dataFromRedis);
    const admin = await this.adminRepository.findOne({
      where: {
        email_address,
      },
    });

    if (!admin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.admin_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.admin_not_found.notification.message`, { lang }),
      );
    }

    await this.adminRepository.update(admin.id, { password });
    await this.redisService.removeItemFromRedis(linkId, this.collectionNamePassword);

    req.session.destroy();

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD_CONFIRM.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminAuthResponseKey}.service.CHANGE_PASSWORD_CONFIRM.success.notification.message`, {
        lang,
      }),
    );
  }
}
