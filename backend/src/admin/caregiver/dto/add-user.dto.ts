import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsPhoneNumberValid, IsUnique } from 'src/common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class AddUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'first_name' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'first_name' }),
  })
  first_name: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'last_name' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'last_name' }),
  })
  last_name: string;

  @IsUnique(
    { tableName: 'users', column: 'phone_number' },
    {
      message: i18nValidationMessage(`${TValidationKey}.PHONE_NUMBER_ALREADY_EXIST`),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone_number' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsUnique(
    { tableName: 'users', column: 'email_address' },
    {
      message: i18nValidationMessage(`${TValidationKey}.EMAIL_ALREADY_EXIST`),
    },
  )
  @IsOptional()
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address?: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'date_of_birth' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'date_of_birth' }),
  })
  date_of_birth: Date;
}

export class AddNewUserIdResponseDto {
  user_id: number;
}
