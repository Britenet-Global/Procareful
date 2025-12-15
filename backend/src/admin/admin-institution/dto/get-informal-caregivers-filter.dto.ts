import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn, IsEnum, ValidateNested } from 'class-validator';
import { EStatus } from 'src/admin/types';
import { ESortOrder } from 'src/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
}
class CaregiverStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'status_name' }) })
  status_name: EStatus;
}
class InformalCaregiversFilterValueDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CaregiverStatusNamesDto)
  status: CaregiverStatusNamesDto;
}

export class GetInformalCaregiversFilterDto {
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
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InformalCaregiversFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: InformalCaregiversFilterValueDto;
}
