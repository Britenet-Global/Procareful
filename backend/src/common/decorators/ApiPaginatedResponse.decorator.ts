import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto, Pagination, Sort, Search } from '../dto';

export const ApiPaginatedResponse = <DataDto extends Type<unknown>, FilterDto extends Type<unknown>>(
  dataDto: DataDto,
  filterDto?: FilterDto,
): MethodDecorator => {
  const apiExtraModelsParams = [PaginatedResponseDto, dataDto, filterDto].filter((e) => e);
  return applyDecorators(
    ApiExtraModels(...apiExtraModelsParams),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              details: {
                type: 'object',
                properties: {
                  pagination: { $ref: getSchemaPath(Pagination) },
                  sort: { $ref: getSchemaPath(Sort) },
                  filter: filterDto && { $ref: getSchemaPath(filterDto) },
                  search: { $ref: getSchemaPath(Search) },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
