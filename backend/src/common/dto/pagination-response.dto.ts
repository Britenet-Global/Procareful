import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from './api-response.dto';

export class Pagination {
  pageSize: number;
  total: number;
  current: number;
}

export class Sort {
  field: string;
  sortOrder: string;
}

export class Search {
  field: string;
}

export class Details<TData, TFilter> {
  @ApiProperty({ type: Pagination })
  pagination: Pagination;

  @ApiProperty({ type: Sort })
  sort: Sort;

  @ApiProperty()
  filter: TFilter;

  @ApiProperty({ type: Search })
  search: Search;

  @ApiProperty()
  items: TData[];
}

export class PaginatedResponseDto<TData, TFilter> {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto;

  @ApiProperty()
  details: Details<TData, TFilter>;
}
