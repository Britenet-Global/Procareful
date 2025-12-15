import { NestedPaginationParamsDto, OptionalNestedPaginationParamsDto } from '../dto/pagination-params.dto';
import { NestedPaginatedResponseDto } from '../dto';

export function createPaginatedResponse<T>(
  items: T[],
  paginationParams: NestedPaginationParamsDto,
  totalItems: number,
): NestedPaginatedResponseDto<T> {
  const { page, pageSize } = paginationParams;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export function createOptionalPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  paginationParams?: OptionalNestedPaginationParamsDto,
): NestedPaginatedResponseDto<T> {
  const { page = 1, pageSize = 10 } = paginationParams;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
