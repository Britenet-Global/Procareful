import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminInstitutionService } from 'src/admin/admin-institution/admin-institution.service';
import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import { UserContact } from 'src/admin/caregiver/entities/userContact.entity';
import { CaregiverRole } from 'src/admin/entities/caregiverRole.entity';
import { Day, WorkingHours } from 'src/admin/entities/workingHours.entity';
import { Address } from 'src/common/entities/address.entity';
import { BadRequestFilterProvider } from 'src/common/filters/bad-request.filter';
import { FilterService } from 'src/filter/filter.service';
import { MinioClientService } from 'src/minio/minio.service';
import { Attachment } from 'src/notes/entities/attachment.entity';
import { Note } from 'src/notes/entities/note.entity';
import { NoteCategory } from 'src/notes/entities/noteCategory.entity';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { AdminService } from '../admin/admin.service';
import { Admin, Institution, Onboarding, Role, Status } from '../admin/entities';
import { DefaultNotificationSettingsService } from '../common/utils/create-default-notification-settings';
import { OnboardingService } from '../common/utils/create-onboarding';
import { EmailService } from '../email/email.service';
import { EmitNotificationsService } from '../notifications/emit-notifications.service';
import { NotificationHistoryRegister, NotificationSettings } from '../notifications/entities';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { EmailLocalStrategy } from './auth/passport/email.local.strategy';
import { PhoneLocalStrategy } from './auth/passport/phone.local.strategy';
import { User } from './entities/user.entity';
import { UserPhysicalActivitiesScores } from './entities/userPhysicalActivitiesScores.entity';
import { Score } from './games/entities';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { LoginMiddleware } from './middlewares/loginMiddleware.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserPersonalGrowth } from './entities/userPersonalGrowth.entity';
import { UserPersonalGrowthChallenges } from './entities/userPersonalGrowthChallenges.entity';
import { UserDifficultyFeedback } from './entities/userDifficultyFeedback.entity';
import { UserGamesExperienceFeedback } from './entities/userGamesExperienceFeedback.entity';
import { UserGamesFeedback } from './entities/userGamesFeedback.entity';
import { UserBrainPoints } from './entities/user.brain-points.entity';
import { VideoService } from './video/video.service';
import { VideoController } from './video/video.controller';
import { Video } from './video/entities/video.entity';
import { UserAssessment } from '../admin/caregiver/entities/userAssessment.entity';
import { UserConditionAssessmentScores } from '../admin/caregiver/entities/userConditionAssesmentScores.entity';
import { UserPhysicalExercises } from '../admin/caregiver/entities/userPhysicalExercises.entity';
import { UserBreathingExercises } from '../admin/caregiver/entities/userBreathingExercises.entity';
import { UserExerciseGroupRepetitions } from './entities/userExerciseGroupRepetitions.entity';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Status,
      Institution,
      Role,
      WorkingHours,
      Day,
      User,
      Address,
      CaregiverRole,
      Score,
      Onboarding,
      Note,
      NoteCategory,
      Attachment,
      UserContact,
      NotificationSettings,
      NotificationHistoryRegister,
      UserActivities,
      UserPhysicalActivitiesScores,
      UserPersonalGrowth,
      UserPersonalGrowthChallenges,
      UserGamesFeedback,
      UserGamesExperienceFeedback,
      UserDifficultyFeedback,
      UserBrainPoints,
      Video,
      UserConditionAssessmentScores,
      UserAssessment,
      UserPhysicalExercises,
      UserBreathingExercises,
      UserExerciseGroupRepetitions,
    ]),
    ConfigModule,
    RedisModule,
    HttpModule,
    LoggerModule,
  ],
  controllers: [UserController, AuthController, GamesController, VideoController],
  providers: [
    PhoneLocalStrategy,
    EmailLocalStrategy,
    UserService,
    AuthService,
    BadRequestFilterProvider,
    EmailService,
    AdminService,
    FilterService,
    ConfigService,
    RedisService,
    AdminInstitutionService,
    MinioClientService,
    GamesService,
    OnboardingService,
    DefaultNotificationSettingsService,
    NotificationsService,
    EmitNotificationsService,
    VideoService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoginMiddleware).forRoutes('user/auth/email/login', 'user/auth/phone/login');
  }
}
