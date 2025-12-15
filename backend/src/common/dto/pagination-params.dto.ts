import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class NestedPaginationParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}

export class OptionalNestedPaginationParamsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;
}
