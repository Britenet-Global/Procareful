import { Module } from '@nestjs/common';
import { MlService } from './ml.service';
import { MlController } from './ml.controller';
import { GamesService } from 'src/user/games/games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from 'src/user/games/entities';
import { FilterService } from 'src/filter/filter.service';
import { User } from 'src/user/entities/user.entity';
import { Admin, CaregiverRole, Day, Institution, Onboarding, Role, Status, WorkingHours } from 'src/admin/entities';
import { AdminInstitutionService } from 'src/admin/admin-institution/admin-institution.service';
import { Address } from 'src/common/entities/address.entity';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { AdminService } from 'src/admin/admin.service';
import { ConfigModule } from '@nestjs/config';
import { MinioClientService } from 'src/minio/minio.service';
import { OnboardingService } from 'src/common/utils/create-onboarding';
import { DefaultNotificationSettingsService } from 'src/common/utils/create-default-notification-settings';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationHistoryRegister, NotificationSettings } from 'src/notifications/entities';
import { EmitNotificationsService } from 'src/notifications/emit-notifications.service';
import { HttpModule } from '@nestjs/axios';
import { UserContact } from 'src/admin/caregiver/entities/userContact.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Score,
      User,
      Admin,
      Institution,
      Status,
      Role,
      WorkingHours,
      Day,
      Address,
      CaregiverRole,
      Onboarding,
      NotificationSettings,
      NotificationHistoryRegister,
      UserContact,
    ]),
    ConfigModule,
    RedisModule,
    HttpModule,
    LoggerModule,
  ],
  providers: [
    MlService,
    GamesService,
    FilterService,
    AdminInstitutionService,
    RedisService,
    EmailService,
    AdminService,
    MinioClientService,
    OnboardingService,
    DefaultNotificationSettingsService,
    NotificationsService,
    EmitNotificationsService,
  ],
  controllers: [MlController],
})
export class MlModule {}
