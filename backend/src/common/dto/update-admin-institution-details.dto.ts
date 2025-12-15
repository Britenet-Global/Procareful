import { IsEmail, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { TValidationKey } from '../utils/translationKeys';

export class UpdateInstitutionDetailsDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'name' }),
  })
  @Length(5, 100, { message: i18nValidationMessage(`${TValidationKey}.LENGTH`, { property: 'name' }) })
  name?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'city' }),
  })
  city?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'street' }),
  })
  street?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'building' }),
  })
  building?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'flat' }),
  })
  flat?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'zip_code' }),
  })
  zip_code?: string;

  @IsOptional()
  @ValidateIf((o) => o.phone !== '')
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone?: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  email?: string;
}
