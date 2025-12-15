import { IsBoolean, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../common/utils/translationKeys';

export class GetNotificationSettingsDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  performance_decline_in_app: boolean;
  performance_decline_email: boolean;
  user_inactive_7_days_in_app: boolean;
  user_inactive_7_days_email: boolean;
  monitoring_visit_in_app: boolean;
  monitoring_visit_email: boolean;
  new_senior_in_app: boolean | null;
  new_senior_email: boolean | null;
  new_FC_assigned_in_app: boolean | null;
  new_FC_assigned_email: boolean | null;
  new_IC_assigned_in_app: boolean | null;
  new_IC_assigned_email: boolean | null;
  user_completed_assignment_in_app: boolean;
  user_completed_assignment_email: boolean;
  new_note_in_app: boolean;
  new_note_email: boolean;
  new_document_in_app: boolean;
  new_document_email: boolean;
  new_care_plan_in_app: boolean;
  new_care_plan_email: boolean;
}
export class UpdateNotificationSettingsDto {
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_FC_assigned_in_app' }),
  })
  @IsOptional()
  new_FC_assigned_in_app?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_FC_assigned_email' }),
  })
  @IsOptional()
  new_FC_assigned_email?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'user_completed_assignment_in_app' }),
  })
  @IsOptional()
  user_completed_assignment_in_app?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'user_completed_assignment_email' }),
  })
  @IsOptional()
  user_completed_assignment_email?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_note_in_app' }),
  })
  @IsOptional()
  new_note_in_app?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_note_email' }),
  })
  @IsOptional()
  new_note_email?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_document_in_app' }),
  })
  @IsOptional()
  new_document_in_app?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_document_email' }),
  })
  @IsOptional()
  new_document_email?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_care_plan_in_app' }),
  })
  @IsOptional()
  new_care_plan_in_app?: boolean;

  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'new_care_plan_email' }),
  })
  @IsOptional()
  new_care_plan_email?: boolean;
}
