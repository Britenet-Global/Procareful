import { IsEnum, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ESortOrder } from 'src/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { EStatus } from '../types';

class FiltersDto {
  @ApiProperty({ enum: EStatus, required: false })
  'filter[status][status_name]': EStatus;
}

class InsitutionStatusNamesDto {
  @IsOptional()
  @IsEnum(EStatus)
  status_name: EStatus;
}

class InsitutionFilterValueDto {
  @IsOptional()
  status: InsitutionStatusNamesDto;
}
export class GetInsitutionsFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @IsIn(['email', 'name'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder)
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InsitutionFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: InsitutionFilterValueDto;
}
