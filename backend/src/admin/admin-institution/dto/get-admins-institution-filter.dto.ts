import { IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { ESortOrder } from '../../../common/types';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class GetAdminsInstitutionFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'pageSize' }),
  })
  @Min(1, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  pageSize?: number;

  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @IsIn(['first_name', 'email_address', 'phone_number'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'caregiver_roles' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;
}
