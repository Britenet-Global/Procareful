import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from 'src/admin/admin-institution/dto';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class EmergencyContactDto {
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

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone_number' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsOptional()
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email_address?: string;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'legal_representative' }),
  })
  legal_representative: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
