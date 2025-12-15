import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class AddressDto {
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
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'additional_info' }),
  })
  additional_info?: string;
}
