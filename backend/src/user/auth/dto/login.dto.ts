import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { IsPhoneNumberValid } from '../../../common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class EmailLoginDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'email' }),
  })
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'pin' }),
  })
  pin: string;
}

export class PhoneLoginDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone' }),
  })
  phone: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'pin' }),
  })
  @Length(6, 6, { message: i18nValidationMessage(`${TValidationKey}.LENGTH`, { property: 'pin' }) })
  pin: string;
}

export class EmailDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'email' }),
  })
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email: string;
}
export class PhoneDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone: string;
}
