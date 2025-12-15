import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { PhoneLoginDto, EmailLoginDto } from '../dto';
import { validate, ValidationError } from 'class-validator';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard(['user-email-local', 'user-phone-local']) implements CanActivate {
  constructor(private readonly redisService: RedisService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const emailDto = plainToInstance(EmailLoginDto, request.body);
    const phoneDto = plainToInstance(PhoneLoginDto, request.body);

    const phoneErrors: ValidationError[] = await validate(phoneDto, { skipMissingProperties: true });
    const emailErrors: ValidationError[] = await validate(emailDto, { skipMissingProperties: true });

    if (phoneErrors.length > 0 || emailErrors.length > 0) {
      const errorMessages = this.extractErrorMessages([...phoneErrors, ...emailErrors]);
      throw new UnauthorizedException(errorMessages);
    }

    const result = (await super.canActivate(context)) as boolean;

    if (result) {
      await super.logIn(request);

      await new Promise<void>((resolve, reject) => {
        request.session.regenerate((err: unknown) => {
          if (err) return reject(err);

          request.login(request.user, (err: unknown) => {
            if (err) return reject(err);

            request.session.save(async (err: unknown) => {
              if (err) return reject(err);
              const sessionId = request?.sessionID;
              const institutionId = request?.user?.userData?.institution?.id;
              if (sessionId && institutionId) {
                await this.redisService.saveSessionInfo(institutionId, sessionId);
              }
              resolve();
            });
          });
        });
      });
    }

    return result;
  }

  private extractErrorMessages(errors: ValidationError[]): string {
    const errorMessages: { [key: string]: string[] } = {};

    errors.forEach((error) => {
      Object.keys(error.constraints).forEach((key) => {
        const errorMessage = error.constraints[key];
        const fieldName = error.property;

        if (!errorMessages[fieldName]) {
          errorMessages[fieldName] = [];
        }

        errorMessages[fieldName].push(errorMessage);
      });
    });

    return JSON.stringify(errorMessages);
  }
}
