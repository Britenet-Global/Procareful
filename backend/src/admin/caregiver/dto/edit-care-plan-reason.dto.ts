import { IsNotEmpty, IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';
import { EEditCarePlanReason } from '../types';

export class EditCarePlanReasonDto {
  @IsNotEmpty()
  @IsEnum(EEditCarePlanReason, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'mobility' }) })
  edit_care_plan_reason: EEditCarePlanReason;
}
