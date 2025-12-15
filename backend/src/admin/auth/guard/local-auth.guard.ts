import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dto';
import { RedisService } from '../../../redis/redis.service';

type TErrorObj = {
  [property: string]: string[];
};

@Injectable()
export class LocalAuthGuard extends AuthGuard('admin-local') implements CanActivate {
  constructor(private readonly redisService: RedisService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginDto = plainToInstance(LoginDto, request.body);

    const errors: ValidationError[] = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = this.extractErrorMessages(errors);
      throw new UnauthorizedException(JSON.stringify(errorMessages));
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

  private extractErrorMessages(errors: ValidationError[]): TErrorObj {
    return errors.reduce((messages: TErrorObj, error) => {
      if (error.property) {
        messages[error.property] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        messages = { ...messages, ...this.extractErrorMessages(error.children) };
      }

      return messages;
    }, {});
  }
}
