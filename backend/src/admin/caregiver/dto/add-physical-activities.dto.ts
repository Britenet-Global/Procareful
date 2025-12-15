import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateIf as ValidateIfBase,
  ValidationOptions,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

const ValidateIfPhysicalActivitiesValid = (validationOptions?: ValidationOptions): ReturnType<typeof ValidateIfBase> =>
  ValidateIfBase(
    (o: AddPhysicalActivitiesDto) =>
      o.currently_bedridden === false && o.can_walk_without_support === true && o.severe_balance_problems === false,
    validationOptions,
  );

export class AddPhysicalActivitiesDto {
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'currently_bedridden' }),
  })
  currently_bedridden: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'can_walk_without_support' }),
  })
  can_walk_without_support: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'severe_balance_problems' }),
  })
  severe_balance_problems: boolean;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'vigorous_activity_days_last_week' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(7, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  vigorous_activity_days_last_week?: number;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'vigorous_activity_minutes_per_day' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(1440, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  vigorous_activity_minutes_per_day?: number | null;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'moderate_activity_days_last_week' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(7, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  moderate_activity_days_last_week?: number;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'moderate_activity_minutes_per_day' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(1440, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  moderate_activity_minutes_per_day?: number | null;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'walking_days_last_week' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(7, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  walking_days_last_week?: number;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'walking_minutes_per_day' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(1440, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  walking_minutes_per_day?: number | null;

  @ValidateIfPhysicalActivitiesValid()
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'time_sitting_last_week' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(1440, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  time_sitting_last_week?: number | null;
}
