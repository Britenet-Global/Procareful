import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Admin } from '../admin/entities';
import { LessThan, Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ENotificationPriority, ENotificationTitle } from '../notifications/types';
import { ERole } from '../admin/types';
import { TSeniorsPerformance } from '../admin/caregiver/dashboards/types';
import { DashboardsService } from '../admin/caregiver/dashboards/dashboards.service';
import { EPriority } from '../admin/caregiver/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CronScheduleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly notificationsService: NotificationsService,

    private readonly dashboardsService: DashboardsService,

    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendNotifyToCaregiversInactiveUsers(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const inactiveUsers = await this.userRepository.find({
      where: { lastActivity: LessThan(sevenDaysAgo) },
      relations: ['admins'],
    });

    if (inactiveUsers.length) {
      for (const user of inactiveUsers) {
        if (!user.admins.length) {
          continue;
        }

        const adminsToNotify = await this.adminRepository
          .createQueryBuilder('admins')
          .leftJoinAndSelect('admins.roles', 'roles')
          .where('admins.id IN (:...adminIds)', { adminIds: user.admins.map((admin) => admin.id) })
          .andWhere('roles.role_name IN (:...roles)', { roles: [ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER] })
          .getMany();

        const link = this.configService.get('domain') + `/seniors/senior-profile?id=${user.id}`;

        if (adminsToNotify.length) {
          await this.notificationsService.sendNotification(
            user.id,
            ENotificationTitle.USER_INACTIVE_7_DAYS,
            ENotificationPriority.HIGH,
            adminsToNotify,
            `${user.first_name} ${user.last_name}`,
            link,
          );
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async checkUserPerformance(): Promise<void> {
    const users = await this.userRepository.find({
      relations: ['admins', 'admins.roles', 'user_quality_of_life'],
    });

    for (const user of users) {
      const performanceResponse = await this.dashboardsService.getUserPerformance(user.id);
      if (performanceResponse.status !== HttpStatus.OK || !performanceResponse.details) {
        continue;
      }

      const performanceDetails = performanceResponse.details as TSeniorsPerformance;
      const performance = performanceDetails.totalPerformance;

      const earliestQualityOfLifeRecord = user.user_quality_of_life.reduce((earliest, current) => {
        return new Date(current.created_at) < new Date(earliest.created_at) ? current : earliest;
      });

      const motivation = earliestQualityOfLifeRecord.motivation;

      let requiredPerformance = 0;
      switch (motivation) {
        case EPriority.LOW:
          requiredPerformance = 40;
          break;
        case EPriority.MEDIUM:
          requiredPerformance = 50;
          break;
        case EPriority.HIGH:
          requiredPerformance = 60;
          break;
        default:
          requiredPerformance = 50;
      }

      if (performance < requiredPerformance) {
        const caregiversToNotify = user.admins.filter((admin) =>
          admin.roles.some((role) => [ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER].includes(role.role_name)),
        );

        const link = this.configService.get('domain') + `/seniors/senior-profile?id=${user.id}&name=Performance`;

        if (caregiversToNotify.length) {
          await this.notificationsService.sendNotification(
            user.id,
            ENotificationTitle.PERFORMANCE_DECLINE,
            ENotificationPriority.HIGH,
            caregiversToNotify.map((caregiver) => ({
              id: caregiver.id,
              email_address: caregiver.email_address,
            })),
            `${user.first_name} ${user.last_name}`,
            link,
          );
        }
      }
    }
  }
}
