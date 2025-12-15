import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  IsPasswordValidConstraint,
  IsUniqueConstraint,
  IsNotEnumValuesConstraint,
  IsEnumValuesValidConstraint,
} from './common/decorators';
import configuration from './config/configuration';
import { EmailModule } from './email/email.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { LoggerModule } from './logger/logger.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationHistoryRegister, NotificationSettings } from './notifications/entities';
import { FilterService } from './filter/filter.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmitNotificationsService } from './notifications/emit-notifications.service';
import { EmailService } from './email/email.service';
import { Admin, CaregiverRole, Day, Institution, Onboarding, Role, Status, WorkingHours } from './admin/entities';
import { User } from './user/entities/user.entity';
import { MaxTwoExercisesPerPositionConstraint } from './common/decorators/maxTwoExercisesPerPosition.decorator';
import { UserPhysicalExercises } from './admin/caregiver/entities/userPhysicalExercises.entity';
import { IsRatingValidConstraint } from './common/decorators/IsRatingValid.decorator';
import { ScheduleModule } from '@nestjs/schedule';
import { CronScheduleService } from './cron-schedule/cron-schedule.service';
import { MlModule } from './ml/ml.module';
import { CaregiverService } from './admin/caregiver/caregiver.service';
import { AdminService } from './admin/admin.service';
import { Address } from './common/entities/address.entity';
import { UserContact } from './admin/caregiver/entities/userContact.entity';
import { Attachment } from './notes/entities/attachment.entity';
import { UserAdditionalInfo } from './admin/caregiver/entities/userAdditionalInfo.entity';
import { UserAssessment } from './admin/caregiver/entities/userAssessment.entity';
import { UserConditionAssessmentScores } from './admin/caregiver/entities/userConditionAssesmentScores.entity';
import { UserRelationships } from './admin/caregiver/entities/userRelationships.entity';
import { UserActivities } from './admin/caregiver/entities/userActivities.entity';
import { UserDocuments } from './admin/caregiver/entities/userDocuments.entity';
import { Score } from './user/games/entities';
import { UserPersonalGrowth } from './user/entities/userPersonalGrowth.entity';
import { AdminInstitutionService } from './admin/admin-institution/admin-institution.service';
import { MinioClientService } from './minio/minio.service';
import { OnboardingService } from './common/utils/create-onboarding';
import { RedisService } from './redis/redis.service';
import { DashboardsService } from './admin/caregiver/dashboards/dashboards.service';
import { DefaultNotificationSettingsService } from './common/utils/create-default-notification-settings';
import { UserPersonalGrowthChallenges } from './user/entities/userPersonalGrowthChallenges.entity';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EThrottleTtlInMiliSeconds, EThrottleLimits } from './common/types';

@Module({
  controllers: [AppController, HealthcheckController, NotificationsController],
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: EThrottleTtlInMiliSeconds.ONE_MINUTE,
          limit: EThrottleLimits.SIXTY,
          skipIf: (ctx): boolean => !ctx.switchToHttp().getRequest().url.includes('/login'),
        },
        {
          ttl: EThrottleTtlInMiliSeconds.ONE_MINUTE,
          limit: EThrottleLimits.SIXTY,
          skipIf: (ctx): boolean => !ctx.switchToHttp().getRequest().url.includes('/generate-pin'),
        },
        {
          ttl: EThrottleTtlInMiliSeconds.ONE_MINUTE,
          limit: EThrottleLimits.SIXTY,
          skipIf: (ctx): boolean => !ctx.switchToHttp().getRequest().url.includes('/resend-verification-code'),
        },
        {
          ttl: EThrottleTtlInMiliSeconds.ONE_MINUTE,
          limit: EThrottleLimits.SIXTY,
        },
      ],
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().port().default(3001),
        PRC_DB_USERNAME: Joi.string().default('postgres'),
        PRC_DB_PASSWORD: Joi.string().default('postgres'),
        PRC_DB_HOST: Joi.string().hostname().default('localhost'),
        PRC_DB_PORT: Joi.number().port().default(5432),
        PRC_DB_DATABASE: Joi.string().default('postgres'),
        PRC_EMAIL_SERVICE: Joi.string().required(),
        PRC_EMAIL_HOST: Joi.string().hostname().required(),
        PRC_EMAIL_PORT: Joi.number().port().default(465),
        PRC_EMAIL_SECURE: Joi.boolean().default(true),
        PRC_EMAIL_USER: Joi.string().required(),
        PRC_EMAIL_PASSWORD: Joi.string().required(),
        PRC_EMAIL_FROM: Joi.string().default(process.env.PRC_EMAIL_USER),
        PRC_REDIS_HOST: Joi.string().hostname().default('localhost'),
        PRC_REDIS_PORT: Joi.number().port().default(6379),
        PRC_RESET_LINK_ID_TTL: Joi.number().default(3600),
        PRC_DOMAIN: Joi.string().uri().default(`http://localhost${process.env.PORT}`),
        PRC_SENIOR_DOMAIN: Joi.string().uri().default(`http://localhost${process.env.PORT}`),
        PRC_SECURE_COOKIE: Joi.boolean().default(false),
        PRC_SESSION_SECRET: Joi.string().default('my-secret'),
        PRC_MINIO_ENDPOINT: Joi.string(),
        PRC_MINIO_PORT: Joi.number().port().default(9000),
        PRC_MINIO_USESSL: Joi.boolean().default(false),
        PRC_MINIO_ACCESSKEY: Joi.string().required(),
        PRC_MINIO_SECRETKEY: Joi.string().required(),
        PRC_MINIO_REGION: Joi.string().required(),
        PRC_MINIO_BUCKET_NAME: Joi.string().required(),
        PRC_MINIO_BUCKET_NAME_NOTES: Joi.string().required(),
        PRC_MINIO_BUCKET_NAME_DOCUMENTS: Joi.string().required(),
        PRC_MINIO_BUCKET_NAME_VIDEOS: Joi.string().required(),
        PRC_APP_VERSION: Joi.string().required(),
        PRC_REPORT_API_KEY: Joi.string().required(),
        PRC_LANDING_PAGE_URL: Joi.string().uri().default(`http://localhost${process.env.PORT}`),
        PRC_ML_DOMAIN: Joi.string().uri().required().default(`http://ml:8000`),
        PRC_SYNCHRONIZE_SCHEMA: Joi.boolean().default(true),
      }),
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        NotificationSettings,
        NotificationHistoryRegister,
        UserPhysicalExercises,
        ScheduleModule.forRoot(),
      ],
      useFactory: (configService: ConfigService) => {
        const { username, host, password, database, port } = configService.get('database');
        const synchronizeSchema = configService.get('synchronizeSchema');
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: synchronizeSchema === 'true',
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      NotificationSettings,
      NotificationHistoryRegister,
      Admin,
      User,
      UserPhysicalExercises,
      User,
      Role,
      Address,
      Status,
      Admin,
      UserContact,
      Attachment,
      UserAdditionalInfo,
      Onboarding,
      UserAssessment,
      UserConditionAssessmentScores,
      UserRelationships,
      UserActivities,
      UserDocuments,
      Institution,
      NotificationSettings,
      WorkingHours,
      Day,
      CaregiverRole,
      NotificationHistoryRegister,
      Score,
      UserPersonalGrowth,
      UserPersonalGrowthChallenges,
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { service, host, port, secure, user, pass, from } = configService.get('email');
        return {
          transport: {
            service,
            host,
            port,
            secure,
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: `Procareful <${from}>`,
          },
          // preview: true,
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    EmailModule,
    AdminModule,
    RouterModule.register([{ path: 'admin', module: AdminModule }]),
    UserModule,
    RouterModule.register([{ path: 'user', module: UserModule }]),
    MlModule,
    RouterModule.register([{ path: 'ml', module: MlModule }]),
    RedisModule,
    LoggerModule,
    ConditionalModule.registerWhen(
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'swagger'),
        serveRoot: '/api/',
      }),
      (env) => env.NODE_ENV === 'development',
    ),
    SessionModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    AppService,
    IsUniqueConstraint,
    IsPasswordValidConstraint,
    MaxTwoExercisesPerPositionConstraint,
    NotificationsService,
    FilterService,
    EmitNotificationsService,
    EmailService,
    IsRatingValidConstraint,
    IsNotEnumValuesConstraint,
    CronScheduleService,
    IsEnumValuesValidConstraint,
    CaregiverService,
    AdminService,
    AdminInstitutionService,
    ConfigService,
    MinioClientService,
    NotificationsService,
    OnboardingService,
    FilterService,
    EmailService,
    RedisService,
    DashboardsService,
    DefaultNotificationSettingsService,
    EmitNotificationsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
