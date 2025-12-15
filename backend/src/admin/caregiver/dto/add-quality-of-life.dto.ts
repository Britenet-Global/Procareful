import { EPriority, EProblemsLevel } from '../types';
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class AddQualityOfLifeDto {
  @IsNotEmpty()
  @IsEnum(EPriority, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'mobility' }) })
  motivation: EPriority;

  @IsNotEmpty()
  @IsEnum(EProblemsLevel, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'mobility' }) })
  mobility: EProblemsLevel;

  @IsNotEmpty()
  @IsEnum(EProblemsLevel, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'self_care' }) })
  self_care: EProblemsLevel;

  @IsNotEmpty()
  @IsEnum(EProblemsLevel, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'usual_activities' }),
  })
  usual_activities: EProblemsLevel;

  @IsNotEmpty()
  @IsEnum(EProblemsLevel, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'pain_discomfort' }) })
  pain_discomfort: EProblemsLevel;

  @IsNotEmpty()
  @IsEnum(EProblemsLevel, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'anxiety_depression' }),
  })
  anxiety_depression: EProblemsLevel;

  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'general_health' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(100, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  general_health: number;
}
