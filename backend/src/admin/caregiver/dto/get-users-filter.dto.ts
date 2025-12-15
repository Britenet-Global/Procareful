import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { EStatus } from '../../types';

class UserStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'status_name' }) })
  status_name: EStatus;
}

class UserFilterValueDto {
  @IsOptional()
  status: UserStatusNamesDto;
}

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
}
export class GetUsersFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'pageSize' }),
  })
  @Min(1, { message: i18nValidationMessage(`${TValidationKey}.PAGE_SIZE_MIN`) })
  pageSize?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'page' }),
  })
  page?: number = 1;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => UserFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: UserFilterValueDto;
}

export class GetUsersAdditionalFilters {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty()
  assessmentCompleted?: boolean;
}
