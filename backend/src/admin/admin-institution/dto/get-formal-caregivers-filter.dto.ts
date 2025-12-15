import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn, IsEnum, ValidateNested } from 'class-validator';
import { EStatus } from 'src/admin/types';
import { ESortOrder } from 'src/common/types';
import { ECaregiverRole } from '../../caregiver/types';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
  @ApiProperty({ enum: ECaregiverRole, required: false })
  'filter[caregiver_roles][role_name]': ECaregiverRole;
}
class CaregiverRolesDto {
  @IsOptional()
  @IsEnum(ECaregiverRole, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'role_name' }) })
  role_name: ECaregiverRole;
}

class CaregiverStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'status_name' }) })
  status_name: EStatus;
}

class FormalCaregiversFilterValueDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CaregiverStatusNamesDto)
  status: CaregiverStatusNamesDto;
  @IsOptional()
  @ValidateNested()
  @Type(() => CaregiverRolesDto)
  caregiver_roles: CaregiverRolesDto;
}

export class GetFormalCaregiversFilterDto {
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
  @IsIn(['first_name', 'email_address', 'phone_number'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FormalCaregiversFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: FormalCaregiversFilterValueDto;
}
