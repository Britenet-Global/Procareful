import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ECaregiverRole } from '../../caregiver/types';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { AddressDto } from '.';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class UpdateCaregiverInfoDto {
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
}
export class UpdateCaregiverContactDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

export class UpdateCaregiverRoleDto {
  @IsEnum(ECaregiverRole, {
    each: true,
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'role_name' }),
  })
  role_name: ECaregiverRole[];
}
