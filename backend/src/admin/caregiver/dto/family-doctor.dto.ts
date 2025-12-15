import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsPhoneNumberValid } from '../../../common/decorators';
import { Type } from 'class-transformer';
import { AddressDto } from '../../admin-institution/dto';
import { EContactType } from '../../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class GetFamilyDoctorDto {
  contact: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_address: string;
    contact_type: EContactType;
  };
  address: {
    id: number;
    city: string;
    street: string;
    building: string;
    flat: string;
    zip_code: string;
    additional_info?: string;
  };
}
export class AddFamilyDoctorDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'first_name' }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'first_name' }),
  })
  first_name: string;

  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'last_name' }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'last_name' }),
  })
  last_name: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  @IsOptional()
  email_address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
