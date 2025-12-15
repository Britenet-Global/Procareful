import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationSettings } from '../../notifications/entities';
import { Repository } from 'typeorm';
import { Admin } from '../../admin/entities';
import { ERole } from '../../admin/types';

@Injectable()
export class DefaultNotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSettings)
    private readonly notificationSettingsRepository: Repository<NotificationSettings>,
  ) {}
  async createDefaultNotificationSettings(admin: Admin, role: string): Promise<void> {
    const isFCrole = role === ERole.FORMAL_CAREGIVER;
    const isICrole = role === ERole.INFORMAL_CAREGIVER;
    const notificationSettings = new NotificationSettings();
    notificationSettings.admin = admin;
    Object.assign(notificationSettings, {
      performance_decline_in_app: true,
      performance_decline_email: true,
      user_inactive_7_days_in_app: true,
      user_inactive_7_days_email: true,
      monitoring_visit_in_app: isFCrole ? true : null,
      monitoring_visit_email: isFCrole ? true : null,
      new_senior_in_app: isFCrole ? true : null,
      new_senior_email: isFCrole ? true : null,
      new_FC_assigned_in_app: isICrole ? true : null,
      new_FC_assigned_email: isICrole ? true : null,
      new_IC_assigned_in_app: isFCrole ? true : null,
      new_IC_assigned_email: isFCrole ? true : null,
      user_completed_assignment_in_app: true,
      user_completed_assignment_email: true,
      new_note_in_app: true,
      new_note_email: true,
      new_document_in_app: isFCrole ? true : null,
      new_document_email: isFCrole ? true : null,
      new_care_plan_in_app: true,
      new_care_plan_email: true,
    });

    await this.notificationSettingsRepository.save(notificationSettings);
  }
}
