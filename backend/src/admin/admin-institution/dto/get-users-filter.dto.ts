import { IsEnum, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { ESortOrder } from '../../../common/types';
import { EStatus } from '../../types';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
}
class UserStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'status_name' }) })
  status_name: EStatus;
}

class UserFilterValueDto {
  @IsOptional()
  status: UserStatusNamesDto;
}

export class GetUsersFilterDto {
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
  @IsIn(['first_name', 'email_address', 'phone_number', 'status.status_name'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: UserFilterValueDto;
}
