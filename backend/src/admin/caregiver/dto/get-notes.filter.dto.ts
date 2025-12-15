import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ESortOrder } from 'src/common/types';
import { TValidationKey } from 'src/common/utils/translationKeys';
import { ENoteCategory } from 'src/notes/types';

class FiltersDto {
  @ApiProperty({ required: false })
  'filter[priority]': boolean;

  @ApiProperty({ required: false })
  'filter[author][id]': number;

  @ApiProperty({ enum: ENoteCategory, required: false })
  'filter[category][category_name]': ENoteCategory;
}

class NotesPriorityDto {
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'completed' }),
  })
  priority: boolean;
}

class NotesAuthorDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'authorId' }),
  })
  authorId: number;
}

class NotesCategoryDto {
  @IsOptional()
  @IsEnum(ENoteCategory, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'category' }) })
  category: ENoteCategory;
}

class NotesFilterValueDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NotesPriorityDto)
  priority: NotesPriorityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotesAuthorDto)
  author: NotesAuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotesCategoryDto)
  category: NotesCategoryDto;
}

export class GetNotesFilterDto {
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
  @IsIn(['title', 'created_at', 'author', 'category.category_name'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  @Type(() => NotesFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: NotesFilterValueDto;
}
