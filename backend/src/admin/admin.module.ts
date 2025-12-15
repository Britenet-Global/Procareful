import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { LocalStrategy } from './auth/passport/local.strategy';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { CaregiverController } from './caregiver/caregiver.controller';
import { CaregiverService } from './caregiver/caregiver.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { LoginMiddleware } from './auth/middlewares/loginMiddleware.middleware';
import { BadRequestFilterProvider } from 'src/common/filters/bad-request.filter';
import { AdminInstitutionService } from './admin-institution/admin-institution.service';
import { AdminInstitutionController } from './admin-institution/admin-institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, CaregiverRole, Day, Institution, Onboarding, Role, Status, WorkingHours } from './entities';
import { TypeORMExceptionFilter } from '../common/filters/typeorm-exception.filter';
import { User } from '../user/entities/user.entity';
import { Address } from 'src/common/entities/address.entity';
import { FilterService } from '../filter/filter.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioClientService } from 'src/minio/minio.service';
import { OnboardingService } from '../common/utils/create-onboarding';
import { Note } from 'src/notes/entities/note.entity';
import { NotesService } from 'src/notes/notes.service';
import { NoteCategory } from 'src/notes/entities/noteCategory.entity';
import { Attachment } from 'src/notes/entities/attachment.entity';
import { UserContact } from './caregiver/entities/userContact.entity';
import { UserSleepAssessment } from './caregiver/entities/userSleepAssessment.entity';
import { UserSocialAbilities } from './caregiver/entities/userSocialAbilities.entity';
import { UserPhysicalActivities } from './caregiver/entities/userPhysicalActivities.entity';
import { UserQualityOfLife } from './caregiver/entities/userQualityOfLife.entity';
import { UserAdditionalInfo } from './caregiver/entities/userAdditionalInfo.entity';
import { UserCognitiveAbilities } from './caregiver/entities/userCognitiveAbilities.entity';
import { NotificationHistoryRegister, NotificationSettings } from 'src/notifications/entities';
import { NotificationsService } from '../notifications/notifications.service';
import { DefaultNotificationSettingsService } from '../common/utils/create-default-notification-settings';
import { UserAssessment } from './caregiver/entities/userAssessment.entity';
import { UserConditionAssessmentScores } from './caregiver/entities/userConditionAssesmentScores.entity';
import { EmitNotificationsService } from '../notifications/emit-notifications.service';
import { UserRelationships } from './caregiver/entities/userRelationships.entity';
import { UserActivities } from './caregiver/entities/userActivities.entity';
import { UserPhysicalExercises } from './caregiver/entities/userPhysicalExercises.entity';
import { UserBreathingExercises } from './caregiver/entities/userBreathingExercises.entity';
import { SchedulesService } from './caregiver/schedules/schedules.service';
import { MaxTwoExercisesPerPositionConstraint } from '../common/decorators/maxTwoExercisesPerPosition.decorator';
import { UserWalkingExercises } from './caregiver/entities/userWalkingExercises.entity';
import { UserDocuments } from './caregiver/entities/userDocuments.entity';
import { DashboardsService } from './caregiver/dashboards/dashboards.service';
import { Score } from '../user/games/entities';
import { InstitutionUserRetrievalStrategy } from './caregiver/dashboards/strategies/InstitutionUserRetrieval.strategy';
import { CaregiverUserRetrievalStrategy } from './caregiver/dashboards/strategies/CaregiverUserRetrieval.strategy';
import { UserPhysicalActivitiesScores } from '../user/entities/userPhysicalActivitiesScores.entity';
import { UserPersonalGrowth } from '../user/entities/userPersonalGrowth.entity';
import { UserPersonalGrowthChallenges } from '../user/entities/userPersonalGrowthChallenges.entity';
import { UserAssignedCarePlanHistory } from 'src/user/entities/userAssignedCarePlanHistory.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Admin,
      Institution,
      Status,
      Role,
      WorkingHours,
      Day,
      Address,
      User,
      CaregiverRole,
      Onboarding,
      Note,
      NoteCategory,
      Attachment,
      UserContact,
      UserSleepAssessment,
      UserSocialAbilities,
      UserPhysicalActivities,
      UserQualityOfLife,
      UserAdditionalInfo,
      UserCognitiveAbilities,
      NotificationSettings,
      NotificationHistoryRegister,
      UserAssessment,
      UserConditionAssessmentScores,
      UserRelationships,
      UserActivities,
      UserPhysicalExercises,
      UserBreathingExercises,
      UserWalkingExercises,
      UserDocuments,
      Score,
      UserPhysicalActivitiesScores,
      UserPersonalGrowth,
      UserPersonalGrowthChallenges,
      UserAssignedCarePlanHistory,
    ]),
    LoggerModule,
  ],
  controllers: [AdminController, AuthController, CaregiverController, AdminInstitutionController],

  providers: [
    LocalStrategy,
    AdminService,
    AuthService,
    CaregiverService,
    RedisService,
    EmailService,
    BadRequestFilterProvider,
    AdminInstitutionService,
    TypeORMExceptionFilter,
    FilterService,
    ConfigService,
    MinioClientService,
    OnboardingService,
    NotesService,
    NotificationsService,
    DefaultNotificationSettingsService,
    EmitNotificationsService,
    SchedulesService,
    MaxTwoExercisesPerPositionConstraint,
    DashboardsService,
    InstitutionUserRetrievalStrategy,
    CaregiverUserRetrievalStrategy,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoginMiddleware).forRoutes('admin/auth/login');
  }
}
