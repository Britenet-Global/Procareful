import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { NotificationHistoryRegister, NotificationSettings } from './entities';
import { In, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createResponse } from '../common/responses/createResponse';
import { TArrayResponse, TResponse } from '../common/types';
import { GetMyNotificationsFilterDto } from 'src/admin/caregiver/dto';
import { FilterService } from 'src/filter/filter.service';
import { createResponseDetails } from 'src/common/responses/createResponseDetails';
import { UpdateNotificationSettingsDto } from './dto';
import { ERole } from '../admin/types';
import { ENotificationPriority, ENotificationTitle } from './types';
import { EmailService } from '../email/email.service';
import { EmitNotificationsService } from './emit-notifications.service';
import { Admin } from '../admin/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AdminInstitutionService } from '../admin/admin-institution/admin-institution.service';
import { User } from '../user/entities/user.entity';
import { AdminService } from '../admin/admin.service';
import { Logger } from '../logger/logger.service';

type ExtendedNotificationSettingsKeys =
  | keyof NotificationSettings
  | ENotificationTitle.ROLE_UPDATED
  | ENotificationTitle.NEW_CARE_PLAN_CHANGED;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(NotificationSettings)
    private readonly notificationSettingsRepository: Repository<NotificationSettings>,

    @InjectRepository(NotificationHistoryRegister)
    private readonly notificationHistoryRegisterRepository: Repository<NotificationHistoryRegister>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly filterService: FilterService,

    private readonly emailService: EmailService,

    private readonly emitNotificationsService: EmitNotificationsService,

    @Inject(forwardRef(() => AdminInstitutionService))
    private readonly adminInstitutionService: AdminInstitutionService,

    private readonly adminService: AdminService,

    private readonly loggerService: Logger,
  ) {}

  private titlesToKeysMap: Record<ENotificationTitle, ExtendedNotificationSettingsKeys[]> = {
    [ENotificationTitle.PERFORMANCE_DECLINE]: ['performance_decline_in_app', 'performance_decline_email'],
    [ENotificationTitle.USER_INACTIVE_7_DAYS]: ['user_inactive_7_days_in_app', 'user_inactive_7_days_email'],
    [ENotificationTitle.MONITORING_VISIT_REQUEST]: ['monitoring_visit_in_app', 'monitoring_visit_email'],
    [ENotificationTitle.NEW_SENIOR_ASSIGNED]: ['new_senior_in_app', 'new_senior_email'],
    [ENotificationTitle.NEW_INFORMAL_CAREGIVER_ASSIGNED]: ['new_IC_assigned_in_app', 'new_IC_assigned_email'],
    [ENotificationTitle.NEW_FORMAL_CAREGIVER_ASSIGNED]: ['new_FC_assigned_in_app', 'new_FC_assigned_email'],
    [ENotificationTitle.USER_COMPLETED_DAILY_ASSIGNMENT]: [
      'user_completed_assignment_in_app',
      'user_completed_assignment_email',
    ],
    [ENotificationTitle.NEW_NOTE_ADDED]: ['new_note_in_app', 'new_note_email'],
    [ENotificationTitle.NEW_DOCUMENT_UPLOADED]: ['new_document_in_app', 'new_document_email'],
    [ENotificationTitle.NEW_CARE_PLAN_ASSIGNED]: ['new_care_plan_in_app', 'new_care_plan_email'],
    [ENotificationTitle.NEW_CARE_PLAN_CHANGED]: [
      ENotificationTitle.NEW_CARE_PLAN_CHANGED,
      ENotificationTitle.NEW_CARE_PLAN_CHANGED,
    ],
    [ENotificationTitle.ROLE_UPDATED]: [ENotificationTitle.ROLE_UPDATED, ENotificationTitle.ROLE_UPDATED],
  };

  private async deleteOldNotifications(caregiverId: number): Promise<void> {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const notificationsToDelete = await this.notificationHistoryRegisterRepository.find({
      where: {
        admin: {
          id: caregiverId,
        },
        notification_in_app: true,
        created_at: LessThan(thirtyDaysAgo),
      },
    });

    if (notificationsToDelete.length) {
      await this.notificationHistoryRegisterRepository.remove(notificationsToDelete);
    }
  }

  async getNotificationSettings(caregiverId: number): Promise<TResponse<NotificationSettings>> {
    const settings = await this.notificationSettingsRepository.findOne({
      where: { admin: { id: caregiverId } },
    });
    return createResponse(HttpStatus.OK, settings, 'Notification settings fetched successfully');
  }

  async getMyNotifications(
    caregiverId: number,
    filterDto: GetMyNotificationsFilterDto,
  ): Promise<TResponse<TArrayResponse<NotificationHistoryRegister>>> {
    const queryBuilder = this.notificationHistoryRegisterRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.admin', 'admin')
      .leftJoinAndSelect('notification.user', 'user')
      .where('admin.id = :caregiverId', { caregiverId })
      .orderBy('notification.created_at', 'DESC');

    await this.deleteOldNotifications(caregiverId);

    const searchFields = ['user.first_name', 'user.last_name'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const notifications = await filteredQueryBuilder.getMany();
    await Promise.all(
      notifications.map(async (notification) => {
        const { details } = await this.adminInstitutionService.getImage(notification.user.id, User);
        notification.user.image_name = typeof details === 'string' ? details : null;
        return notification;
      }),
    );
    const response = createResponseDetails<NotificationHistoryRegister>(notifications, filterDto, total);

    return createResponse(HttpStatus.OK, response, 'My notifications fetched successfully');
  }

  async updateNotificationSettings(
    caregiverId: number,
    notificationSettingsDto: UpdateNotificationSettingsDto,
  ): Promise<TResponse> {
    const settingsToUpdate = await this.notificationSettingsRepository.findOne({
      where: { admin: { id: caregiverId } },
      relations: ['admin', 'admin.roles'],
    });
    if (!settingsToUpdate) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Notification settings not found');
    }
    const FCRole = settingsToUpdate.admin.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (FCRole) {
      delete notificationSettingsDto.new_FC_assigned_in_app;
      delete notificationSettingsDto.new_FC_assigned_email;
    }
    Object.assign(settingsToUpdate, notificationSettingsDto);
    await this.notificationSettingsRepository.save(settingsToUpdate);

    return createResponse(HttpStatus.OK, null, 'Notification settings updated successfully');
  }
  async sendNotification(
    seniorId: number,
    title: ENotificationTitle,
    priority: ENotificationPriority,
    adminsToNotify: Partial<Admin>[],
    senior_name?: string,
    link?: string,
  ): Promise<void> {
    const lang = I18nContext.current()?.lang;

    try {
      const notificationSettings = await this.notificationSettingsRepository.find({
        where: {
          admin: In(adminsToNotify.map(({ id }) => id)),
        },
        relations: ['admin'],
      });

      const adminSettings = notificationSettings.map((settings) => {
        const notifications = this.titlesToKeysMap[title].reduce(
          (result, key) => {
            result[key] = settings[key as keyof NotificationSettings];
            return result;
          },
          {} as Partial<Record<ExtendedNotificationSettingsKeys, number | boolean | Admin | Date>>,
        );

        return {
          ...notifications,
          adminId: settings.admin.id,
          adminEmail: settings.admin.email_address,
        };
      });

      await Promise.all(
        adminSettings.map(async ({ adminId, adminEmail, ...el }) => {
          const adminLanguage = lang || (await this.adminService.getLanguage(adminId)).toLowerCase();
          const [appNotif, emailNotif] = Object.values(el);

          if (appNotif || emailNotif) {
            const notificationHistoryRegister = new NotificationHistoryRegister();

            Object.assign(notificationHistoryRegister, {
              ...(emailNotif && { date_of_email_sending: new Date() }),
              notification_in_app: appNotif,
              notification_by_email: emailNotif,
              admin: adminId,
              user: seniorId,
              title,
              priority,
            });

            this.notificationHistoryRegisterRepository.save(notificationHistoryRegister);
          }

          if (appNotif) {
            this.emitNotificationsService.emitEvent(title, { adminId, title });
          }

          if (emailNotif) {
            const subject = this.i18n.t(`translation.notificationEmails.${title}.subject`, {
              lang: adminLanguage,
            });
            const body = this.i18n.t(`translation.notificationEmails.${title}.body`, {
              lang: adminLanguage,
              args: { name: senior_name },
            });
            const button = this.i18n.t(`translation.notificationEmails.${title}.button`, {
              lang: adminLanguage,
            });
            this.emailService.sendNotificationEmail(adminEmail, subject, body, button, link, adminLanguage);
          }
        }),
      );
    } catch (error) {
      this.loggerService.log(error);
    }
  }

  async markNotificationsAsRead(caregiverId: number, notificationIds: number[]): Promise<TResponse> {
    const caregiver = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
      },
      relations: ['notification'],
    });

    if (!caregiver) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Admin not found');
    }

    const notifications = caregiver.notification.filter((n) => notificationIds.includes(n.id));

    if (notifications.length === 0) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Notification not found');
    }

    notifications.forEach((notification) => {
      notification.displayed = true;
    });

    await this.notificationHistoryRegisterRepository.save(notifications);

    return createResponse(HttpStatus.OK, null, 'Notifications marked as displayed');
  }

  async getUnreadNotificationCount(caregiverId: number): Promise<TResponse<number>> {
    const [, unreadNotificationCount] = await this.notificationHistoryRegisterRepository.findAndCountBy({
      admin: {
        id: caregiverId,
      },
      displayed: false,
    });

    await this.deleteOldNotifications(caregiverId);

    return createResponse(HttpStatus.OK, unreadNotificationCount, 'Unread notification count fetched');
  }
}
