import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsEnum, ValidateNested, IsIn } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ESortOrder } from 'src/common/types';
import { TValidationKey } from 'src/common/utils/translationKeys';
import { ENotificationPriority, ENotificationTitle } from 'src/notifications/types';

class FiltersDto {
  @ApiProperty({ enum: ENotificationPriority, required: false })
  'filter[priority]': ENotificationPriority;

  @ApiProperty({ enum: ENotificationTitle, required: false })
  'filter[title]': ENotificationTitle;

  @ApiProperty({ required: false })
  'filter[user][id]': number;
}

class MyNotificationsPriorityDto {
  @IsOptional()
  @IsEnum(ENotificationPriority, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'priority' }) })
  priority: ENotificationPriority;
}

class MyNotificationsTitleDto {
  @IsOptional()
  @IsEnum(ENotificationTitle, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'title' }) })
  title: ENotificationTitle;
}

class MyNotificationsUserDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'userId' }),
  })
  userId: number;
}

class MyNotificationsFilterValueDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => MyNotificationsPriorityDto)
  priority: MyNotificationsPriorityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MyNotificationsTitleDto)
  title: MyNotificationsTitleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MyNotificationsUserDto)
  userId: MyNotificationsUserDto;
}

export class GetMyNotificationsFilterDto {
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
  @IsIn(['created_at', 'priority', 'title'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }) })
  sortOrder?: ESortOrder;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => MyNotificationsFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter?: MyNotificationsFilterValueDto;
}
