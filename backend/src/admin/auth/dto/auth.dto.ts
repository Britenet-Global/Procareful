import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsPasswordValid } from '../../../common/decorators';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'newPassword' }),
  })
  @IsPasswordValid({ message: `${TValidationKey}.AUTH_PASSWORD` })
  newPassword: string;
}
