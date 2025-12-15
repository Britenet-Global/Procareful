import { IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { AddressDto } from '.';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class SetMyPersonalSettingsDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'first_name' }),
  })
  first_name?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'last_name' }),
  })
  last_name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: i18nValidationMessage(`${TValidationKey}.DATE`, { property: 'date_of_birth' }),
  })
  date_of_birth?: Date | null;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number?: string;

  @IsOptional()
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
