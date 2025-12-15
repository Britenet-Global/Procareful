import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { EPersonalRate } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../common/utils/translationKeys';

export class UpdateUserFeedbackDto {
  @IsOptional()
  @IsEnum(EPersonalRate, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'personal_rate' }) })
  personal_rate?: EPersonalRate;

  @IsOptional()
  @IsString()
  @Length(0, 256)
  stuck_in_memory_the_most?: string;

  @IsOptional()
  @IsString()
  @Length(0, 256)
  positive_emotions?: string;
}
