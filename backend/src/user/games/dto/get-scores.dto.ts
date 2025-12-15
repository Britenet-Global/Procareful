import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { ESortOrder } from '../../../common/types';
import { EDifficultyLevel, EGame } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';
import { ApiProperty } from '@nestjs/swagger';

class FiltersDto {
  @ApiProperty({ required: false })
  'filter[completed]': boolean;
}

class GamesCompletedDto {
  @IsOptional()
  completed: boolean;
}

class ScoresFilterValueDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => GamesCompletedDto)
  completed: GamesCompletedDto;
}
export class GetScoresFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'pageSize' }),
  })
  @Min(1, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  pageSize?: number;

  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  @IsIn(['created_at'], { message: `${TValidationKey}.SORT_BY` })
  sortBy?: string;

  @IsOptional()
  @IsEnum(ESortOrder, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sortOrder' }),
  })
  sortOrder?: ESortOrder;

  @IsOptional()
  @Type(() => ScoresFilterValueDto)
  @ApiProperty({ type: FiltersDto })
  filter: ScoresFilterValueDto;
}
export class GetScoresDateDto {
  @IsOptional()
  startDate: string;
  @IsOptional()
  endDate: string;
}
export class GetScoresDto {
  id: number;
  created_at: Date;
  completion_time: number;
  number_of_tries: number;
  number_of_hints_used: number;
  score: number;
  number_of_wins: number;
  snake_length: number;
  number_of_hearts_used: number;
  number_of_tries_to_guess: number;
  completed: boolean;
  game_name: EGame;
  game_level: EDifficultyLevel;
  user: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email_address: string;
    image_name: string;
  };
}
