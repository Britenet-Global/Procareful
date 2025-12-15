import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'password' }),
  })
  password: string;
}
