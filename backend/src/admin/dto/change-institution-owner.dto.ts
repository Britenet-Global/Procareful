import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique, IsPhoneNumberValid } from 'src/common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../common/utils/translationKeys';

export class ChangeInstitutionOwnerDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsUnique(
    { tableName: 'admins', column: 'email_address' },
    {
      message: i18nValidationMessage(`${TValidationKey}.EMAIL_ALREADY_EXIST`),
    },
  )
  @IsNotEmpty()
  @IsEmail()
  email_address: string;

  @IsUnique(
    { tableName: 'admins', column: 'phone_number' },
    {
      message: i18nValidationMessage(`${TValidationKey}.PHONE_NUMBER_ALREADY_EXIST`),
    },
  )
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;
}
