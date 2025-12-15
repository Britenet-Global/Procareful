import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { AddressDto } from '.';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

class UpdateInfoBaseDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'first_name' }),
  })
  first_name: string;

  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'last_name' }),
  })
  last_name: string;
}

export class UpdateInfoDto extends UpdateInfoBaseDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'date_of_birth' }),
  })
  @IsDateString()
  date_of_birth?: Date;
}

export class UpdateAdminInfoDto extends UpdateInfoBaseDto {}

export class UpdateContactBaseDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsOptional()
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address: string | null;
}

export class UpdateBasicInformationDto extends UpdateInfoDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsOptional()
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address: string;
}

export class UpdateContactDto extends UpdateContactBaseDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

export class UpdateAdminContactDto extends UpdateContactBaseDto {}
