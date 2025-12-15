import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsUnique, IsPhoneNumberValid } from 'src/common/decorators';
import { AddressDto } from './address.dto';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class AddFormalCaregiverDto {
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
    { tableName: 'admins', column: 'phone_number' },
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
    { tableName: 'admins', column: 'email_address' },
    {
      message: i18nValidationMessage(`${TValidationKey}.EMAIL_ALREADY_EXIST`),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'email_address' }),
  })
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
