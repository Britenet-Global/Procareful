import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsPasswordValid } from '../../../common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { Transform } from 'class-transformer';

export class SignupDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'password' }),
  })
  @IsPasswordValid({ message: `${TValidationKey}.AUTH_PASSWORD` })
  password: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone' }),
  })
  phone: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'token' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'token' }),
  })
  token: string;
}
