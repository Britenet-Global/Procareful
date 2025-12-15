import { SelectQueryBuilder } from 'typeorm';
import { ESortOrder } from '../common/types';
import { dot } from 'dot-object';
import { GetUsersAdditionalFilters } from '../admin/caregiver/dto';

interface TFilterDto<F> {
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: ESortOrder;
  search?: string;
  filter?: F;
}

export class FilterService {
  applyFilters<T, F>(
    queryBuilder: SelectQueryBuilder<T>,
    filterDto: TFilterDto<F>,
    searchFields?: string[],
    additionalFilters?: GetUsersAdditionalFilters,
  ): SelectQueryBuilder<T> {
    const { pageSize, page, sortBy, sortOrder, search, filter } = filterDto;

    if (pageSize) {
      queryBuilder.skip((page - 1) * pageSize).take(pageSize);
    }

    if (filter) {
      const dottedObj = {};
      dot(filter, dottedObj);
      Object.entries(dottedObj).forEach(([filterBy, filterValue]) => {
        queryBuilder.andWhere(`${filterBy} = :${filterBy}`, { [filterBy]: filterValue });
      });
    }

    if (additionalFilters) {
      this.applyAdditionalFilters(queryBuilder, additionalFilters);
    }

    if (sortBy && sortOrder) {
      const order = sortOrder.toUpperCase() === ESortOrder.DESC ? ESortOrder.DESC : ESortOrder.ASC;
      const sortByField = sortBy.includes('.') ? sortBy : `${queryBuilder.alias}.${sortBy}`;
      queryBuilder.orderBy(sortByField, order);
    }

    if (search && searchFields) {
      const searchTerms = search.split(' ').filter((term) => term);
      const searchConditions = searchTerms.map((_, index) =>
        searchFields.map((field) => `${field} ILIKE :term${index}`).join(' OR '),
      );

      queryBuilder.andWhere(
        `(${searchConditions.join(' AND ')})`,
        searchTerms.reduce((conditions, term, index) => ({ ...conditions, [`term${index}`]: `%${term}%` }), {}),
      );
    }

    return queryBuilder;
  }
  applyAdditionalFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    additionalFilters: GetUsersAdditionalFilters,
  ): SelectQueryBuilder<T> {
    Object.entries(additionalFilters).forEach(([filterBy, filterValue]) => {
      if (filterBy === 'assessmentCompleted') {
        if (filterValue) {
          queryBuilder.andWhere('assessment.id IS NOT NULL');
        } else {
          queryBuilder.andWhere('assessment.id IS NULL');
        }
      } else {
        queryBuilder.andWhere(`${filterBy} = :${filterBy}`, { [filterBy]: filterValue });
      }
    });
    return queryBuilder;
  }
}
