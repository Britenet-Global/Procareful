import { IsEnum, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ESortOrder } from 'src/common/types';
import { EStatus } from '../types';
import { ApiProperty } from '@nestjs/swagger';

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
}

class SuperInsitutionAdminStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus)
  status_name: EStatus;
}

class SuperInsitutionAdminFilterValueDto {
  @IsOptional()
  status: SuperInsitutionAdminStatusNamesDto;
}
export class GetSuperInsitutionAdminsFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @IsIn(['email_address', 'institution.name', 'status.status_name'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder)
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SuperInsitutionAdminFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: SuperInsitutionAdminFilterValueDto;
}
