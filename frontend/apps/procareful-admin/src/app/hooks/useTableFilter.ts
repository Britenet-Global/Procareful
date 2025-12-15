import { useState } from 'react';

type FilterState<T> = {
  [Key in keyof T]: T[Key];
} & {
  page?: number;
};

type useTableFilterReturn<T> = {
  filters: FilterState<T>;
  handleFilterChange: (field: keyof T) => (value: T[keyof T]) => void;
};

const useTableFilter = <T>(initialFilters: FilterState<T>): useTableFilterReturn<T> => {
  const [filters, setFilters] = useState<FilterState<T>>({
    ...initialFilters,
    page: initialFilters.page ?? 1,
  });

  const handleFilterChange = (field: keyof T) => (value: T[keyof T]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
      page: field === 'page' ? (value as number) : 1, // Reset page to 1 for non-page fields
    }));
  };

  return { filters, handleFilterChange };
};

export default useTableFilter;
