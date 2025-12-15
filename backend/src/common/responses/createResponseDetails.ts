import { ESortOrder, TArrayResponse } from '../types';

type TFilters = {
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: ESortOrder;
  filterValue?: string;
  filterBy?: string;
  search?: string;
};

export const createResponseDetails = <T>(
  items: T[],
  { pageSize, page, sortBy, sortOrder, filterValue, filterBy, search }: TFilters,
  total: number,
): TArrayResponse<T> => {
  return {
    pagination: {
      pageSize,
      total,
      current: page,
    },
    sort: {
      field: sortBy,
      sortOrder,
    },
    filter: {
      field: filterBy,
      filterValue,
    },
    search: {
      field: search,
    },
    items,
  };
};
