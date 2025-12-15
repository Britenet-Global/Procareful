import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAssessment } from '../entities/userAssessment.entity';
import { createResponse } from '../../../common/responses/createResponse';
import { In, Repository } from 'typeorm';
import { UserConditionAssessmentScores } from '../entities/userConditionAssesmentScores.entity';
import {
  EActivityLevel,
  EBreathingExerciseBedridden,
  EBreathingExercisePosition,
  EBreathingExerciseSitting,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
  EPhysicalExercisesBedridden,
  EPhysicalExercisesMobilityLimitations,
  EPhysicalExercisesNoMobilityLimitations,
  EPhysicalExercisesNoMobilityLimitationsCondensed,
  EUserPhysicalActivityGroup,
  EWalkingLevel,
} from '../types';
import { UserActivities } from '../entities/userActivities.entity';
import { UserPhysicalExercises } from '../entities/userPhysicalExercises.entity';
import { EPersonalGrowth, TGeneratedSchedules, TObjectActivitiesToAssign, TSchedule } from './types';
import { UserBreathingExercises } from '../entities/userBreathingExercises.entity';
import { TResponse } from '../../../common/types';
import { TCommonResponseKey, TSchedulesResponseKey } from '../../../common/utils/translationKeys';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CaregiverService } from '../caregiver.service';
import { ScheduleBedriddenDto, ScheduleMobilityLimitationsDto, ScheduleNoLimitationsDto } from '../dto';
import { UserWalkingExercises } from '../entities/userWalkingExercises.entity';
import { GetWalkingTime } from './dto/get-walking-time.dto';
import { NotificationsService } from '../../../notifications/notifications.service';
import { User } from '../../../user/entities/user.entity';
import { Admin } from '../../entities';
import { ERole } from '../../types';
import { ENotificationPriority, ENotificationTitle } from '../../../notifications/types';
import { ConfigService } from '@nestjs/config';
import { EmitNotificationsService } from '../../../notifications/emit-notifications.service';
import { UserPersonalGrowth } from 'src/user/entities/userPersonalGrowth.entity';
import { UserPersonalGrowthChallenges } from 'src/user/entities/userPersonalGrowthChallenges.entity';
import { UserAssignedCarePlanHistory } from 'src/user/entities/userAssignedCarePlanHistory.entity';
import { TUserAssignedCarePlanHistory } from 'src/user/types';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(UserAssessment)
    private readonly userAssessmentRepository: Repository<UserAssessment>,

    @InjectRepository(UserPhysicalExercises)
    private readonly userPhysicalExercisesRepository: Repository<UserPhysicalExercises>,

    @InjectRepository(UserConditionAssessmentScores)
    private readonly userConditionAssessmentScoresRepository: Repository<UserConditionAssessmentScores>,

    @InjectRepository(UserActivities)
    private readonly userActivitiesRepository: Repository<UserActivities>,

    @InjectRepository(UserBreathingExercises)
    private readonly userBreathingExercisesRepository: Repository<UserBreathingExercises>,

    @InjectRepository(UserWalkingExercises)
    private readonly userWalkingExercisesRepository: Repository<UserWalkingExercises>,

    @InjectRepository(UserPersonalGrowthChallenges)
    private readonly userPersonalGrowthChallengesRepository: Repository<UserPersonalGrowthChallenges>,

    @InjectRepository(UserPersonalGrowth)
    private readonly userPersonalGrowthRepository: Repository<UserPersonalGrowth>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserAssignedCarePlanHistory)
    private readonly userAssignedCarePlanHistory: Repository<UserAssignedCarePlanHistory>,

    private readonly i18n: I18nService,

    private readonly caregiverService: CaregiverService,

    private readonly notificationService: NotificationsService,

    private readonly configService: ConfigService,

    private readonly emitNotificationsService: EmitNotificationsService,
  ) {}

  private shuffle<T>(array: T[]): T[] {
    return array.sort(() => 0.5 - Math.random());
  }

  private async caregiversAssignedToSenior(seniorId: number): Promise<Admin[]> {
    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    return caregivers;
  }

  private async assignActivitiesObject(objectToAssign: TObjectActivitiesToAssign): Promise<UserActivities> {
    const userActivities = new UserActivities();
    Object.assign(userActivities, objectToAssign);
    await this.userActivitiesRepository.save(userActivities);
    await this.userAssignedCarePlanHistory.save<TUserAssignedCarePlanHistory>({
      number_of_physical_exercises: objectToAssign.user_physical_exercises.length,
      physical_activities_intensity: objectToAssign.physical_level,
      number_of_breathing_activities: objectToAssign.user_breathing_exercises.length,
      breathing_activities_intensity: objectToAssign.breathing_level,
      personal_growth: !!objectToAssign.personal_growth?.length,
      activity_group: objectToAssign.activity_group,
      walking_exercise: !!objectToAssign.user_walking_exercises,
      walking_level: objectToAssign.user_walking_exercises?.walking_level,
      user: objectToAssign.user,
    });
    return userActivities;
  }

  private async findExercises(
    user_physical_exercises: (
      | EPhysicalExercisesBedridden
      | EPhysicalExercisesMobilityLimitations
      | EPhysicalExercisesNoMobilityLimitations
    )[],
    user_breathing_exercises: (EBreathingExerciseBedridden | EBreathingExerciseSitting)[],
  ): Promise<{ physicalExercises: UserPhysicalExercises[]; breathingExercises: UserBreathingExercises[] }> {
    const physicalExercises = await this.userPhysicalExercisesRepository.findBy({
      name: In(user_physical_exercises),
    });

    const breathingExercises = await this.userBreathingExercisesRepository.findBy({
      name: In(user_breathing_exercises),
    });

    return { physicalExercises, breathingExercises };
  }

  private async findUserActivities(
    seniorId: number,
    caregiverId: number,
    relations: string[],
  ): Promise<UserActivities | null> {
    return this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: seniorId,
          admins: {
            id: caregiverId,
          },
        },
      },
      relations,
    });
  }

  private calculateWalkingTime(time: number, walkingLevel: EWalkingLevel): number {
    switch (walkingLevel) {
      case EWalkingLevel.SAME_AS_NOW:
        return time;
      case EWalkingLevel.PLUS_10_PERCENT:
        return Math.ceil((time * 1.1) / 5) * 5;
      case EWalkingLevel.PLUS_20_PERCENT:
        return Math.ceil((time * 1.2) / 5) * 5;
    }
  }

  private async canAssignUserSchedule(
    seniorId: number,
    activitiesGroup: EUserPhysicalActivityGroup,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userAssessmentScore = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: { id: seniorId },
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!userAssessmentScore) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.user_condition_assessment_scores_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.user_condition_assessment_scores_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const userActivitiesGroup = userAssessmentScore.physical_activities_group;

    if (userActivitiesGroup !== activitiesGroup) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.cannot_assign_different_phys_activity.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.cannot_assign_different_phys_activity.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.can_assign_user_schedule.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TSchedulesResponseKey}.service.CAN_ASSIGN_USER_SCHEDULE.can_assign_user_schedule.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async generateBasicSchedule(caregiverId: number, userId: number): Promise<TSchedule> {
    const [usersScores, userAssessment] = await Promise.all([
      this.userConditionAssessmentScoresRepository.findOne({
        where: {
          user_assessment: {
            users: { id: userId, admins: { id: caregiverId } },
          },
        },
        order: { created_at: 'DESC' },
      }),
      this.userAssessmentRepository.findOne({
        where: {
          users: { id: userId, admins: { id: caregiverId } },
        },
        relations: ['user_physical_activities'],
        order: { created_at: 'DESC' },
      }),
    ]);
    if (!usersScores || !userAssessment) {
      return null;
    }

    const { physical_activities_group: usersMobility, physical_activities_tier: recommendedActivityLevel } =
      usersScores;

    let declaredWalkingTime = null;
    let physicalActivities: EPhysicalExercises[] = [];
    let breathingExercises: EBreathingExerciseType[] = [];

    const fetchAndShuffleExercises = async (
      position: EPhysicalExercisePosition,
      min: number,
      max: number,
    ): Promise<UserPhysicalExercises[]> => {
      const allPhysicalExercises = await this.userPhysicalExercisesRepository.find({ where: { position } });
      return this.shuffle(allPhysicalExercises).slice(0, Math.floor(Math.random() * (max - min + 1)) + min);
    };
    const fetchAndShuffleBreathingExercises = async (
      position: EBreathingExercisePosition,
      min: number,
      max: number,
    ): Promise<EBreathingExerciseType[]> => {
      const allBreathingExercises = await this.userBreathingExercisesRepository.find({ where: { position } });
      return this.shuffle(allBreathingExercises)
        .slice(0, Math.floor(Math.random() * (max - min + 1)) + min)
        .map((ex: UserBreathingExercises) => ex.name);
    };

    if (usersMobility === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES) {
      physicalActivities = (await fetchAndShuffleExercises(EPhysicalExercisePosition.EXERCISE_IN_BED, 3, 5)).map(
        (ex: UserPhysicalExercises) => ex.name,
      );
      breathingExercises = await fetchAndShuffleBreathingExercises(EBreathingExercisePosition.EXERCISE_IN_BED, 1, 2);
    } else if (usersMobility === EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES) {
      const positions = [
        EPhysicalExercisePosition.SITTING_BALANCE_AND_COORDINATION,
        EPhysicalExercisePosition.SITTING_LOWER_BODY,
        EPhysicalExercisePosition.SITTING_UPPER_BODY,
      ];
      await Promise.all(
        positions.map(async (position) => {
          const selectedExercises = await fetchAndShuffleExercises(position, 1, 2);
          physicalActivities = physicalActivities.concat(selectedExercises.map((ex: UserPhysicalExercises) => ex.name));
        }),
      );
      breathingExercises = await fetchAndShuffleBreathingExercises(EBreathingExercisePosition.EXERCISE_SITTING, 1, 2);
    } else if (usersMobility === EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES) {
      const obligatoryExercises = [
        EPhysicalExercises.LIFTING_LEG_FORWARDS,
        EPhysicalExercises.LIFTING_LEG_BACKWARDS,
        EPhysicalExercises.LIFTING_LEG_TO_THE_SIDE,
        EPhysicalExercises.BENDING_KNEE_LIFTING_LEG_AND_TOUCHING_IT_WITH_OPPOSITE_HAND,
      ];
      const additionalExercises = [EPhysicalExercises.STANDING_ON_TOES, EPhysicalExercises.LEANING_THE_BODY_FORWARD];
      const allExercises = [...obligatoryExercises, ...additionalExercises];

      const fetchedExercises = await this.userPhysicalExercisesRepository.find({
        where: { name: In(allExercises) },
      });

      const fetchedObligatoryExercises = fetchedExercises.filter((ex) => obligatoryExercises.includes(ex.name));
      const fetchedAdditionalExercises = fetchedExercises.filter((ex) => additionalExercises.includes(ex.name));

      physicalActivities = fetchedObligatoryExercises.map((ex: UserPhysicalExercises) => ex.name);
      const selectedRandomlyAdditionalExercises = this.shuffle(fetchedAdditionalExercises)
        .slice(0, Math.floor(Math.random() * 2) + 1)
        .map((ex: UserPhysicalExercises) => ex.name);

      physicalActivities = physicalActivities.concat(selectedRandomlyAdditionalExercises);
      declaredWalkingTime = userAssessment.user_physical_activities.walking_minutes_per_day || 15;
      breathingExercises = await fetchAndShuffleBreathingExercises(EBreathingExercisePosition.EXERCISE_SITTING, 1, 2);
    }

    const basicSchedule = { physicalActivities, breathingExercises };
    return { basicSchedule, recommendedActivityLevel, usersMobility, declaredWalkingTime };
  }
  async generateSchedules(caregiverId: number, userId: number): Promise<TResponse<TGeneratedSchedules>> {
    const lang = I18nContext.current().lang;

    const [light, moderate, intense] = await Promise.all([
      this.generateBasicSchedule(caregiverId, userId),
      this.generateBasicSchedule(caregiverId, userId),
      this.generateBasicSchedule(caregiverId, userId),
    ]);

    if (!light || !moderate || !intense) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TSchedulesResponseKey}.service.GENERATE_SCHEDULES.cannot_be_generated.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TSchedulesResponseKey}.service.GENERATE_SCHEDULES.cannot_be_generated.notification.message`, {
          lang,
        }),
      );
    }

    const walkingTime = light.declaredWalkingTime;

    const schedules = {
      userMobility: light.usersMobility,
      recommendedLevel: light.recommendedActivityLevel,
      light: { ...light.basicSchedule, walkingTime },
      moderate: {
        ...moderate.basicSchedule,
        walkingTime: walkingTime !== null ? Math.ceil((walkingTime * 1.1) / 5) * 5 : null,
      },
      intense: {
        ...intense.basicSchedule,
        walkingTime: walkingTime !== null ? Math.ceil((walkingTime * 1.2) / 5) * 5 : null,
      },
    };

    return createResponse(
      HttpStatus.OK,
      schedules,
      this.i18n.t(`${TSchedulesResponseKey}.service.GENERATE_SCHEDULES.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.GENERATE_SCHEDULES.success.notification.message`, {
        lang,
      }),
    );
  }

  async getUserSchedule(caregiverId: number, seniorId: number): Promise<TResponse<UserActivities>> {
    const lang = I18nContext.current().lang;

    const schedule = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: seniorId,
          admins: {
            id: caregiverId,
          },
        },
      },
      relations: ['user_physical_exercises', 'user_breathing_exercises', 'user_walking_exercises'],
    });

    if (!schedule) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TSchedulesResponseKey}.service.GET_USER_SCHEDULE.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TSchedulesResponseKey}.service.GET_USER_SCHEDULE.not_found.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.OK,
      schedule,
      this.i18n.t(`${TSchedulesResponseKey}.service.GET_USER_SCHEDULE.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.GET_USER_SCHEDULE.success.notification.message`, {
        lang,
      }),
    );
  }

  private async findConditionAssessment(
    caregiverId: number,
    seniorId: number,
  ): Promise<TResponse | UserConditionAssessmentScores> {
    const lang = I18nContext.current().lang;
    const isUserAssignedToAdmin = await this.caregiverService.isUserAssignedToAdmin(caregiverId, seniorId);

    if (!isUserAssignedToAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const existingUserActivities = await this.userActivitiesRepository.findOne({
      where: { user: { id: seniorId } },
    });

    if (existingUserActivities) {
      return createResponse(
        HttpStatus.CONFLICT,
        null,
        this.i18n.t(
          `${TSchedulesResponseKey}.service.FIND_CONDITION_ASSESSMENT.activities_already_exist.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TSchedulesResponseKey}.service.FIND_CONDITION_ASSESSMENT.activities_already_exist.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const userConditionAssessment = await this.userConditionAssessmentScoresRepository.findOne({
      where: { user_assessment: { users: { id: seniorId } } },
      relations: ['user_assessment', 'user_assessment.users', 'user_assessment.user_physical_activities'],
      order: { created_at: 'DESC' },
    });

    if (!userConditionAssessment) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TSchedulesResponseKey}.service.FIND_CONDITION_ASSESSMENT.assessment_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TSchedulesResponseKey}.service.FIND_CONDITION_ASSESSMENT.assessment_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    return userConditionAssessment;
  }

  async addCustomScheduleBedridden(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      personal_growth,
    }: ScheduleBedriddenDto,
  ): Promise<TResponse<{ id: number }>> {
    const lang = I18nContext.current().lang;

    const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

    if ('status' in userConditionAssessment) {
      return userConditionAssessment;
    }

    const { physicalExercises, breathingExercises } = await this.findExercises(
      user_physical_exercises,
      user_breathing_exercises,
    );

    const userActivities = await this.assignActivitiesObject({
      user: { id: seniorId },
      breathing_level,
      physical_level,
      user_physical_exercises: physicalExercises,
      user_breathing_exercises: breathingExercises,
      activity_group: EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES,
      ...(personal_growth && { personal_growth }),
    });

    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
      ENotificationPriority.MEDIUM,
      caregivers,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    return createResponse(
      HttpStatus.CREATED,
      { id: userActivities.id },
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
        lang,
      }),
    );
  }

  async updateCustomScheduleBedridden(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      personal_growth,
    }: ScheduleBedriddenDto,
  ): Promise<TResponse<null | { id: number }>> {
    const lang = I18nContext.current().lang;

    const canAssignSchedule = await this.canAssignUserSchedule(
      seniorId,
      EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES,
    );

    if ('status' in canAssignSchedule && canAssignSchedule.status === HttpStatus.BAD_REQUEST) {
      return canAssignSchedule;
    }

    const userActivities = await this.findUserActivities(seniorId, caregiverId, [
      'user_physical_exercises',
      'user_breathing_exercises',
    ]);

    const { physicalExercises, breathingExercises } = await this.findExercises(
      user_physical_exercises,
      user_breathing_exercises,
    );

    if (!userActivities) {
      const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

      if ('status' in userConditionAssessment) {
        return userConditionAssessment;
      }
      const userActivities = await this.assignActivitiesObject({
        user: { id: seniorId },
        breathing_level,
        physical_level,
        user_physical_exercises: physicalExercises,
        user_breathing_exercises: breathingExercises,
        activity_group: EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES,
        ...(personal_growth && { personal_growth }),
      });

      return createResponse(
        HttpStatus.CREATED,
        { id: userActivities.id },
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
          lang,
        }),
      );
    }

    const objectToAssign = {
      user: { id: seniorId },
      breathing_level,
      physical_level,
      user_physical_exercises: physicalExercises,
      user_breathing_exercises: breathingExercises,
      personal_growth: personal_growth || null,
    };

    Object.assign(userActivities, objectToAssign);
    await this.userActivitiesRepository.save(userActivities);
    await this.userAssignedCarePlanHistory.save<TUserAssignedCarePlanHistory>({
      number_of_physical_exercises: physicalExercises.length,
      physical_activities_intensity: physical_level,
      number_of_breathing_activities: breathingExercises.length,
      breathing_activities_intensity: breathing_level,
      personal_growth: !!personal_growth,
      activity_group: EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES,
      walking_exercise: false,
      walking_level: null,
      user: { id: seniorId },
    });

    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
      ENotificationPriority.MEDIUM,
      caregivers,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    this.emitNotificationsService.emitCarePlanChangedEvent(seniorId);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.updated.notification.message`, {
        lang,
      }),
    );
  }

  async addCustomScheduleMobilityLimitations(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      personal_growth,
    }: ScheduleMobilityLimitationsDto,
  ): Promise<TResponse<{ id: number }>> {
    const lang = I18nContext.current().lang;

    const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

    if ('status' in userConditionAssessment) {
      return userConditionAssessment;
    }

    const { physicalExercises, breathingExercises } = await this.findExercises(
      user_physical_exercises,
      user_breathing_exercises,
    );

    const userActivities = await this.assignActivitiesObject({
      user: { id: seniorId },
      breathing_level,
      physical_level,
      user_physical_exercises: physicalExercises,
      user_breathing_exercises: breathingExercises,
      activity_group: EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES,
      ...(personal_growth && { personal_growth }),
    });

    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
      ENotificationPriority.MEDIUM,
      caregivers,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    return createResponse(
      HttpStatus.CREATED,
      { id: userActivities.id },
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
        lang,
      }),
    );
  }

  async updateCustomScheduleMobilityLimitations(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      personal_growth,
    }: ScheduleMobilityLimitationsDto,
  ): Promise<TResponse<null | { id: number }>> {
    const lang = I18nContext.current().lang;

    const canAssignSchedule = await this.canAssignUserSchedule(
      seniorId,
      EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES,
    );

    if ('status' in canAssignSchedule && canAssignSchedule.status === HttpStatus.BAD_REQUEST) {
      return canAssignSchedule;
    }

    const userActivities = await this.findUserActivities(seniorId, caregiverId, [
      'user_physical_exercises',
      'user_breathing_exercises',
    ]);

    const { physicalExercises, breathingExercises } = await this.findExercises(
      user_physical_exercises,
      user_breathing_exercises,
    );

    if (!userActivities) {
      const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

      if ('status' in userConditionAssessment) {
        return userConditionAssessment;
      }

      const userActivities = await this.assignActivitiesObject({
        user: { id: seniorId },
        breathing_level,
        physical_level,
        user_physical_exercises: physicalExercises,
        user_breathing_exercises: breathingExercises,
        activity_group: EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES,
        ...(personal_growth && { personal_growth }),
      });
      return createResponse(
        HttpStatus.CREATED,
        { id: userActivities.id },
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
          lang,
        }),
      );
    }

    const objectToAssign = {
      user: { id: seniorId },
      breathing_level,
      physical_level,
      user_physical_exercises: physicalExercises,
      user_breathing_exercises: breathingExercises,
      personal_growth: personal_growth || null,
    };

    Object.assign(userActivities, objectToAssign);
    await this.userActivitiesRepository.save(userActivities);

    await this.userAssignedCarePlanHistory.save<TUserAssignedCarePlanHistory>({
      number_of_physical_exercises: physicalExercises.length,
      physical_activities_intensity: physical_level,
      number_of_breathing_activities: breathingExercises.length,
      breathing_activities_intensity: breathing_level,
      personal_growth: !!personal_growth,
      activity_group: EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES,
      walking_exercise: false,
      walking_level: null,
      user: { id: seniorId },
    });

    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
      ENotificationPriority.MEDIUM,
      caregivers,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    this.emitNotificationsService.emitCarePlanChangedEvent(seniorId);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.updated.notification.message`, {
        lang,
      }),
    );
  }

  private updateEnumValues(
    exercises: EPhysicalExercisesNoMobilityLimitationsCondensed[],
  ): EPhysicalExercisesNoMobilityLimitations[] {
    const updatedArray = exercises.map((item) => {
      if (item === EPhysicalExercisesNoMobilityLimitationsCondensed.LIFTING_LEG) {
        return [
          EPhysicalExercisesNoMobilityLimitations.LIFTING_LEG_TO_THE_SIDE,
          EPhysicalExercisesNoMobilityLimitations.LIFTING_LEG_BACKWARDS,
          EPhysicalExercisesNoMobilityLimitations.LIFTING_LEG_FORWARDS,
        ];
      }
      return item as unknown as EPhysicalExercisesNoMobilityLimitations;
    });
    return updatedArray.flat();
  }

  async addCustomScheduleNoLimitations(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      user_walking_exercises,
      personal_growth,
    }: ScheduleNoLimitationsDto,
  ): Promise<TResponse<{ id: number }>> {
    const lang = I18nContext.current().lang;

    const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

    if ('status' in userConditionAssessment) {
      return userConditionAssessment;
    }

    const userPhysicalExercisesMapped = this.updateEnumValues(user_physical_exercises);

    const { physicalExercises, breathingExercises } = await this.findExercises(
      userPhysicalExercisesMapped,
      user_breathing_exercises,
    );

    if (userConditionAssessment instanceof UserConditionAssessmentScores) {
      const time = userConditionAssessment.user_assessment.user_physical_activities.walking_minutes_per_day || 15;

      const walkingExercises = new UserWalkingExercises();
      Object.assign(walkingExercises, {
        walking_level: user_walking_exercises,
        time: this.calculateWalkingTime(time, user_walking_exercises),
      });

      await this.userWalkingExercisesRepository.save(walkingExercises);

      const userActivities = await this.assignActivitiesObject({
        user: { id: seniorId },
        breathing_level,
        physical_level,
        user_physical_exercises: physicalExercises,
        user_breathing_exercises: breathingExercises,
        user_walking_exercises: walkingExercises,
        activity_group: EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES,
        ...(personal_growth && { personal_growth }),
      });

      const senior = await this.userRepository.findOne({
        where: { id: seniorId },
        relations: ['admins.roles'],
      });
      const admins = senior.admins;
      const caregivers = admins.filter((caregiver) => {
        const roles = caregiver.roles || [];
        return roles.some(
          (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
        );
      });

      const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

      await this.notificationService.sendNotification(
        seniorId,
        ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
        ENotificationPriority.MEDIUM,
        caregivers,
        senior.first_name + ' ' + senior.last_name,
        link,
      );

      return createResponse(
        HttpStatus.CREATED,
        { id: userActivities.id },
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
          lang,
        }),
      );
    }
  }

  async updateCustomScheduleNoLimitations(
    caregiverId: number,
    seniorId: number,
    {
      user_physical_exercises,
      user_breathing_exercises,
      breathing_level,
      physical_level,
      user_walking_exercises,
      personal_growth,
    }: ScheduleNoLimitationsDto,
  ): Promise<TResponse<null | { id: number }>> {
    const lang = I18nContext.current().lang;

    const canAssignSchedule = await this.canAssignUserSchedule(
      seniorId,
      EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES,
    );

    if ('status' in canAssignSchedule && canAssignSchedule.status === HttpStatus.BAD_REQUEST) {
      return canAssignSchedule;
    }

    const userActivities = await this.findUserActivities(seniorId, caregiverId, [
      'user_physical_exercises',
      'user_breathing_exercises',
      'user_walking_exercises',
    ]);

    const userPhysicalExercisesMapped = this.updateEnumValues(user_physical_exercises);

    const { physicalExercises, breathingExercises } = await this.findExercises(
      userPhysicalExercisesMapped,
      user_breathing_exercises,
    );

    if (!userActivities) {
      const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

      if ('status' in userConditionAssessment) {
        return userConditionAssessment;
      }

      if (userConditionAssessment instanceof UserConditionAssessmentScores) {
        const time = userConditionAssessment.user_assessment.user_physical_activities.walking_minutes_per_day || 15;
        const walkingExercises = new UserWalkingExercises();
        Object.assign(walkingExercises, {
          walking_level: user_walking_exercises,
          time: this.calculateWalkingTime(time, user_walking_exercises),
        });

        await this.userWalkingExercisesRepository.save(walkingExercises);

        const userActivities = await this.assignActivitiesObject({
          user: { id: seniorId },
          breathing_level,
          physical_level,
          user_physical_exercises: physicalExercises,
          user_breathing_exercises: breathingExercises,
          user_walking_exercises: walkingExercises,
          activity_group: EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES,
          ...(personal_growth && { personal_growth }),
        });

        return createResponse(
          HttpStatus.CREATED,
          { id: userActivities.id },
          this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.title`, {
            lang,
          }),
          this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.added.notification.message`, {
            lang,
          }),
        );
      }
    }

    const userConditionAssessment = await this.userConditionAssessmentScoresRepository.findOne({
      where: { user_assessment: { users: { id: seniorId } } },
      relations: ['user_assessment', 'user_assessment.users', 'user_assessment.user_physical_activities'],
      order: { created_at: 'DESC' },
    });

    const time = userConditionAssessment.user_assessment.user_physical_activities.walking_minutes_per_day || 15;

    Object.assign(userActivities.user_walking_exercises, {
      walking_level: user_walking_exercises,
      time: this.calculateWalkingTime(time, user_walking_exercises),
    });

    await this.userWalkingExercisesRepository.save(userActivities.user_walking_exercises);

    Object.assign(userActivities, {
      user: { id: seniorId },
      breathing_level,
      physical_level,
      user_physical_exercises: physicalExercises,
      user_breathing_exercises: breathingExercises,
      personal_growth: personal_growth || null,
    });

    await this.userActivitiesRepository.save(userActivities);
    await this.userAssignedCarePlanHistory.save<TUserAssignedCarePlanHistory>({
      number_of_physical_exercises: physicalExercises.length,
      physical_activities_intensity: physical_level,
      number_of_breathing_activities: breathingExercises.length,
      breathing_activities_intensity: breathing_level,
      personal_growth: !!personal_growth,
      activity_group: EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES,
      walking_exercise: !!user_walking_exercises,
      walking_level: user_walking_exercises,
      user: { id: seniorId },
    });

    const senior = await this.userRepository.findOne({
      where: { id: seniorId },
      relations: ['admins.roles'],
    });
    const admins = senior.admins;
    const caregivers = admins.filter((caregiver) => {
      const roles = caregiver.roles || [];
      return roles.some(
        (role) => role.role_name === ERole.INFORMAL_CAREGIVER || role.role_name === ERole.FORMAL_CAREGIVER,
      );
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Care+Plan`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_CARE_PLAN_ASSIGNED,
      ENotificationPriority.MEDIUM,
      caregivers,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    this.emitNotificationsService.emitCarePlanChangedEvent(seniorId);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.custom_updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.ADD_CUSTOM_SCHEDULE.custom_updated.notification.message`, {
        lang,
      }),
    );
  }

  async saveSchedule(
    caregiverId: number,
    seniorId: number,
    schedules: TResponse<TGeneratedSchedules>,
    activityLevel: EActivityLevel,
    personal_growth: EPersonalGrowth,
  ): Promise<TResponse | TResponse<TGeneratedSchedules> | TResponse<{ id: number }>> {
    if ('details' in schedules && schedules.details === null) {
      return schedules;
    }

    const { userMobility, light, moderate, intense } = schedules.details as TGeneratedSchedules;

    let response: TResponse | TResponse<{ id: number }>;

    if (userMobility === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES) {
      if (activityLevel === EActivityLevel.LIGHT) {
        response = await this.addCustomScheduleBedridden(caregiverId, seniorId, {
          user_physical_exercises: light.physicalActivities as unknown as EPhysicalExercisesBedridden[],
          user_breathing_exercises: light.breathingExercises as unknown as EBreathingExerciseBedridden[],
          breathing_level: EActivityLevel.LIGHT,
          physical_level: EActivityLevel.LIGHT,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.MODERATE) {
        response = await this.addCustomScheduleBedridden(caregiverId, seniorId, {
          user_physical_exercises: moderate.physicalActivities as unknown as EPhysicalExercisesBedridden[],
          user_breathing_exercises: moderate.breathingExercises as unknown as EBreathingExerciseBedridden[],
          breathing_level: EActivityLevel.MODERATE,
          physical_level: EActivityLevel.MODERATE,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.INTENSE) {
        response = await this.addCustomScheduleBedridden(caregiverId, seniorId, {
          user_physical_exercises: intense.physicalActivities as unknown as EPhysicalExercisesBedridden[],
          user_breathing_exercises: intense.breathingExercises as unknown as EBreathingExerciseBedridden[],
          breathing_level: EActivityLevel.INTENSE,
          physical_level: EActivityLevel.INTENSE,
          personal_growth: personal_growth || null,
        });
      }
    } else if (userMobility === EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES) {
      if (activityLevel === EActivityLevel.LIGHT) {
        response = await this.addCustomScheduleMobilityLimitations(caregiverId, seniorId, {
          user_physical_exercises: light.physicalActivities as unknown as EPhysicalExercisesMobilityLimitations[],
          user_breathing_exercises: light.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.LIGHT,
          physical_level: EActivityLevel.LIGHT,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.MODERATE) {
        response = await this.addCustomScheduleMobilityLimitations(caregiverId, seniorId, {
          user_physical_exercises: moderate.physicalActivities as unknown as EPhysicalExercisesMobilityLimitations[],
          user_breathing_exercises: moderate.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.MODERATE,
          physical_level: EActivityLevel.MODERATE,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.INTENSE) {
        response = await this.addCustomScheduleMobilityLimitations(caregiverId, seniorId, {
          user_physical_exercises: intense.physicalActivities as unknown as EPhysicalExercisesMobilityLimitations[],
          user_breathing_exercises: intense.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.INTENSE,
          physical_level: EActivityLevel.INTENSE,
          personal_growth: personal_growth || null,
        });
      }
    } else if (userMobility === EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES) {
      if (activityLevel === EActivityLevel.LIGHT) {
        response = await this.addCustomScheduleNoLimitations(caregiverId, seniorId, {
          user_physical_exercises:
            light.physicalActivities as unknown as EPhysicalExercisesNoMobilityLimitationsCondensed[],
          user_breathing_exercises: light.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.LIGHT,
          physical_level: EActivityLevel.LIGHT,
          user_walking_exercises: EWalkingLevel.SAME_AS_NOW,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.MODERATE) {
        response = await this.addCustomScheduleNoLimitations(caregiverId, seniorId, {
          user_physical_exercises:
            moderate.physicalActivities as unknown as EPhysicalExercisesNoMobilityLimitationsCondensed[],
          user_breathing_exercises: moderate.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.MODERATE,
          physical_level: EActivityLevel.MODERATE,
          user_walking_exercises: EWalkingLevel.PLUS_10_PERCENT,
          personal_growth: personal_growth || null,
        });
      } else if (activityLevel === EActivityLevel.INTENSE) {
        response = await this.addCustomScheduleNoLimitations(caregiverId, seniorId, {
          user_physical_exercises:
            intense.physicalActivities as unknown as EPhysicalExercisesNoMobilityLimitationsCondensed[],
          user_breathing_exercises: intense.breathingExercises as unknown as EBreathingExerciseSitting[],
          breathing_level: EActivityLevel.INTENSE,
          physical_level: EActivityLevel.INTENSE,
          user_walking_exercises: EWalkingLevel.PLUS_20_PERCENT,
          personal_growth: personal_growth || null,
        });
      }
    }

    if (personal_growth) {
      await this.createDefaultPersonalGrowthChallenge(seniorId);
    }

    return response;
  }

  async createDefaultPersonalGrowthChallenge(seniorId: number): Promise<void> {
    const userPersonalGrowthChallenges = await this.userPersonalGrowthChallengesRepository.find({
      order: { created_at: 'ASC' },
    });
    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: seniorId,
        },
      },
      relations: ['user_personal_growth', 'user_personal_growth.user_personal_growth_challenges'],
    });
    const defaultPersonalChallenge = new UserPersonalGrowth();

    Object.assign(defaultPersonalChallenge, {
      active: true,
      userActivities,
      user_personal_growth_challenges: userPersonalGrowthChallenges[0],
    });

    await this.userPersonalGrowthRepository.save(defaultPersonalChallenge);
  }

  async getWalkingTime(caregiverId: number, seniorId: number): Promise<TResponse<GetWalkingTime>> {
    const lang = I18nContext.current().lang;

    const userConditionAssessment = await this.findConditionAssessment(caregiverId, seniorId);

    if ('status' in userConditionAssessment) {
      return userConditionAssessment;
    }

    const time = userConditionAssessment.user_assessment.user_physical_activities.walking_minutes_per_day || 15;

    const response = {
      [EWalkingLevel.SAME_AS_NOW]: this.calculateWalkingTime(time, EWalkingLevel.SAME_AS_NOW),
      [EWalkingLevel.PLUS_10_PERCENT]: this.calculateWalkingTime(time, EWalkingLevel.PLUS_10_PERCENT),
      [EWalkingLevel.PLUS_20_PERCENT]: this.calculateWalkingTime(time, EWalkingLevel.PLUS_20_PERCENT),
    };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TSchedulesResponseKey}.service.GET_WALKING_TIME.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TSchedulesResponseKey}.service.GET_WALKING_TIME.success.notification.message`, {
        lang,
      }),
    );
  }
}
