import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import { createResponse } from 'src/common/responses/createResponse';
import { TResponse } from 'src/common/types';
import { TUserResponseKey } from 'src/common/utils/translationKeys';
import { Between, In, Raw, Repository } from 'typeorm';
import {
  AddGameFeedbackAfterSecondLoss,
  AddGameFeedbackClosingGameBeforeCompletion,
  AddGameFeedbackIncreasedDifficultyLevel,
  GetGameFeedbackDisplayOptions,
  GetUserActivitiesListDto,
  UpdateBrainPoints,
  UpdateUserFeedbackDto,
  UpdateUserPhysicalActivitiesScoresDto,
} from './dto';
import { UserPhysicalActivitiesScores } from './entities/userPhysicalActivitiesScores.entity';
import { Score } from './games/entities';
import {
  CompletedBreathingExercise,
  CompletedPhysicalExercise,
  EFeedbackType,
  EUserExerciseTypes,
  TGetUserActivitiesListBreathingResponse,
  TGetUserActivitiesListGenerateResponse,
  TGetUserActivitiesListPhysicalResponse,
  TGetUserActivitiesListWalkingResponse,
  TUserCompletedActivities,
  TUserDashboard,
  TUserSchedule,
} from './types';
import {
  EActivityLevel,
  EBreathingExerciseType,
  EPhysicalExercises,
  EUserPhysicalActivityGroup,
  EWalkingExercises,
} from 'src/admin/caregiver/types';
import { UserPersonalGrowth } from './entities/userPersonalGrowth.entity';
import { UserPersonalGrowthChallenges } from './entities/userPersonalGrowthChallenges.entity';
import { UserGamesFeedback } from './entities/userGamesFeedback.entity';
import { UserGamesExperienceFeedback } from './entities/userGamesExperienceFeedback.entity';
import { UserDifficultyFeedback } from './entities/userDifficultyFeedback.entity';
import { EGame } from './games/types';
import { UserBrainPoints } from './entities/user.brain-points.entity';
import { User } from './entities/user.entity';
import { UserConditionAssessmentScores } from '../admin/caregiver/entities/userConditionAssesmentScores.entity';
import { UserAssessment } from '../admin/caregiver/entities/userAssessment.entity';
import { UserPhysicalExercises } from '../admin/caregiver/entities/userPhysicalExercises.entity';
import { UserBreathingExercises } from '../admin/caregiver/entities/userBreathingExercises.entity';
import { UserWalkingExercises } from '../admin/caregiver/entities/userWalkingExercises.entity';
import { ENotificationPriority, ENotificationTitle } from 'src/notifications/types';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationHistoryRegister } from 'src/notifications/entities';
import { UserExerciseGroupRepetitions } from './entities/userExerciseGroupRepetitions.entity';
import { ELanguage } from '../admin/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,

    private readonly notificationService: NotificationsService,

    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,

    @InjectRepository(UserActivities)
    private readonly userActivitiesRepository: Repository<UserActivities>,

    @InjectRepository(UserPhysicalActivitiesScores)
    private readonly userPhysicalActivitiesRepository: Repository<UserPhysicalActivitiesScores>,

    @InjectRepository(UserPersonalGrowth)
    private readonly userPersonalGrowthRepository: Repository<UserPersonalGrowth>,

    @InjectRepository(UserPersonalGrowthChallenges)
    private readonly userPersonalGrowthChallengesRepository: Repository<UserPersonalGrowthChallenges>,

    @InjectRepository(UserGamesFeedback)
    private readonly userGamesFeedbackRepository: Repository<UserGamesFeedback>,

    @InjectRepository(UserGamesExperienceFeedback)
    private readonly userGamesExperienceFeedbackRepository: Repository<UserGamesExperienceFeedback>,

    @InjectRepository(UserDifficultyFeedback)
    private readonly userDifficultyFeedbackRepository: Repository<UserDifficultyFeedback>,

    @InjectRepository(UserBrainPoints)
    private readonly userBrainPointsRepository: Repository<UserBrainPoints>,

    @InjectRepository(UserConditionAssessmentScores)
    private readonly userConditionAssessmentScoresRepository: Repository<UserConditionAssessmentScores>,

    @InjectRepository(UserPhysicalActivitiesScores)
    private readonly userPhysicalActivitiesScoresRepository: Repository<UserPhysicalActivitiesScores>,

    @InjectRepository(UserAssessment)
    private readonly userAssessmentRepository: Repository<UserAssessment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserPhysicalExercises)
    private readonly userPhysicalExercisesRepository: Repository<UserPhysicalExercises>,

    @InjectRepository(UserBreathingExercises)
    private readonly userBreathingExercisesRepository: Repository<UserBreathingExercises>,

    @InjectRepository(NotificationHistoryRegister)
    private readonly notificationHistoryRegisterRepository: Repository<NotificationHistoryRegister>,

    @InjectRepository(UserExerciseGroupRepetitions)
    private readonly userExerciseGroupRepetitionsRepository: Repository<UserExerciseGroupRepetitions>,

    private readonly configService: ConfigService,
  ) {}

  private async findNextChallenge(
    userId: number,
    currentChallengeId: number,
  ): Promise<UserPersonalGrowthChallenges | null> {
    const allChallenges = await this.userPersonalGrowthChallengesRepository.find({
      order: { created_at: 'ASC' },
    });

    const currentIndex = allChallenges.findIndex((challenge) => challenge.id === currentChallengeId);
    if (currentIndex === -1) {
      return null;
    }

    const totalChallenges = allChallenges.length;

    for (let i = 1; i < totalChallenges; i++) {
      const nextIndex = (currentIndex + i) % totalChallenges;
      const challenge = allChallenges[nextIndex];

      const existingGrowth = await this.userPersonalGrowthRepository.findOne({
        where: {
          userActivities: { user: { id: userId } },
          user_personal_growth_challenges: { id: challenge.id },
        },
      });

      if (!existingGrowth || !existingGrowth.completed) {
        return challenge;
      }
    }

    return null;
  }

  private async calculateDayStreak(userId: number, currentDate: Date): Promise<number> {
    let streak = 0;
    let date = currentDate;

    while (true) {
      const startOfDay = dayjs(date).startOf('day').toDate();
      const endOfDay = dayjs(date).endOf('day').toDate();

      const activities = await this.scoreRepository.find({
        where: {
          user: { id: userId },
          created_at: Between(startOfDay, endOfDay),
        },
      });

      const physicalActivities = await this.userPhysicalActivitiesRepository.find({
        where: {
          userActivities: { user: { id: userId } },
          created_at: Between(startOfDay, endOfDay),
        },
      });

      const personalGrowthActivities = await this.userPersonalGrowthRepository.find({
        where: {
          userActivities: { user: { id: userId } },
          updated_at: Between(startOfDay, endOfDay),
          completed: true,
        },
      });

      if (activities.length > 0 || physicalActivities.length > 0 || personalGrowthActivities.length > 0) {
        streak++;
        date = dayjs(date).subtract(1, 'day').toDate();
      } else {
        break;
      }
    }
    return streak;
  }

  private translatePersonalGrowthChallenges(completedPersonalGrowth: UserPersonalGrowth[]): UserPersonalGrowth[] {
    const lang = I18nContext.current().lang;

    return completedPersonalGrowth.map((activity) => {
      const challenge = activity.user_personal_growth_challenges;

      return {
        ...activity,
        user_personal_growth_challenges: {
          ...challenge,
          title: this.i18n.t(`translation.personal_growth_challenges.${challenge.title}`, {
            lang,
          }),
          description: this.i18n.t(`translation.personal_growth_challenges.${challenge.description}`, {
            lang,
          }),
        },
      };
    });
  }

  private translatePhysicalExercise(userActivities: UserPhysicalExercises[]): UserPhysicalExercises[] {
    const lang = I18nContext.current().lang;

    return userActivities.map((activity) => {
      return {
        ...activity,
        description: activity.description
          ? this.i18n.t(`translation.physical_exercises.${activity.description}`, { lang })
          : null,
      };
    });
  }

  private translateBreathingExercise(userActivities: UserBreathingExercises[]): UserBreathingExercises[] {
    const lang = I18nContext.current().lang;

    return userActivities.map((activity) => {
      return {
        ...activity,
        description: activity.description
          ? this.i18n.t(`translation.breathe_exercises.${activity.description}`, { lang })
          : null,
      };
    });
  }

  async getDashboard(userId: number): Promise<TResponse<TUserDashboard>> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['admins'],
    });
    const firstName = user.first_name;

    const today = dayjs().day();
    const isTargetDay3_1 = [1, 3, 5].includes(today);
    const isTargetDay3_2 = [2, 4, 6].includes(today);
    const isTargetDay5 = [1, 2, 3, 4, 5].includes(today);

    const userAssessment = await this.userAssessmentRepository.findOne({
      where: {
        users: { id: userId },
      },
    });
    if (!userAssessment) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.assessment_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.assessment_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const userAssessmentScore = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: { id: userId },
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    const userActivitiesGroup = userAssessmentScore.physical_activities_group;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user_physical_exercises', 'user_breathing_exercises', 'user_walking_exercises'],
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const {
      user_physical_exercises,
      user_breathing_exercises,
      user_walking_exercises,
      physical_level,
      breathing_level,
      personal_growth,
    } = userActivities;

    const personalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        active: true,
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['user_personal_growth_challenges'],
    });

    const todayScores = await this.userPhysicalActivitiesScoresRepository.find({
      where: {
        userActivities: {
          user: {
            id: userId,
          },
        },
        created_at: Between(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()),
      },
    });

    const gameScore = await this.scoreRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        created_at: Between(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()),
      },
    });

    const physicalExercises: CompletedPhysicalExercise[] = user_physical_exercises.map((el) => ({
      name: el.name,
      completed: false,
    }));

    const breathingExercises: CompletedBreathingExercise[] = user_breathing_exercises.map((el) => ({
      name: el.name,
      completed: false,
    }));

    const schedule: TUserSchedule = {
      games: { completed: !!gameScore },
      physicalExercises,
      breathingExercises,
    };

    if (personal_growth) {
      const countCompletedPersonalGrowthChallenges = await this.userPersonalGrowthRepository.count({
        where: {
          completed: true,
          userActivities: {
            user: {
              id: userId,
            },
          },
        },
      });
      const allPersonalGrowthChallenges = await this.userPersonalGrowthChallengesRepository.count();

      if (personalGrowth) {
        const [translatedUserPersonalGrowth] = this.translatePersonalGrowthChallenges([personalGrowth]);

        schedule.personalGrowth = {
          id: translatedUserPersonalGrowth.id,
          title: translatedUserPersonalGrowth.user_personal_growth_challenges.title,
          description: translatedUserPersonalGrowth.user_personal_growth_challenges.description,
          completed: translatedUserPersonalGrowth.completed,
          allPersonalGrowthChallengesCompleted: countCompletedPersonalGrowthChallenges === allPersonalGrowthChallenges,
        };
      } else {
        schedule.personalGrowth = {
          allPersonalGrowthChallengesCompleted: countCompletedPersonalGrowthChallenges === allPersonalGrowthChallenges,
        };
      }
    }

    if (userActivitiesGroup === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES) {
      if (physical_level === EActivityLevel.INTENSE) {
        schedule.physicalExercisesMorning = user_physical_exercises.map((el) => ({
          name: el.name,
          completed: false,
        }));
        schedule.physicalExercisesMidDay = user_physical_exercises.map((el) => ({
          name: el.name,
          completed: false,
        }));
        delete schedule.physicalExercises;
      }
      if (breathing_level === EActivityLevel.INTENSE) {
        schedule.breathingExercisesMorning = user_breathing_exercises.map((el) => ({
          name: el.name,
          completed: false,
        }));
        schedule.breathingExercisesMidDay = user_breathing_exercises.map((el) => ({
          name: el.name,
          completed: false,
        }));
        delete schedule.breathingExercises;
      }
    } else if (userActivitiesGroup === EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES) {
      if (physical_level === EActivityLevel.LIGHT && !isTargetDay3_2) {
        delete schedule.physicalExercises;
      } else if (physical_level === EActivityLevel.MODERATE && !isTargetDay5) {
        delete schedule.physicalExercises;
      }
      if (breathing_level === EActivityLevel.LIGHT && !isTargetDay3_1) {
        delete schedule.breathingExercises;
      } else if (breathing_level === EActivityLevel.MODERATE && !isTargetDay5) {
        delete schedule.breathingExercises;
      }
    } else if (userActivitiesGroup === EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES) {
      schedule.walkingExercises = {
        time: user_walking_exercises.time,
        completed: false,
      };
      if (physical_level === EActivityLevel.LIGHT && !isTargetDay3_2) {
        delete schedule.physicalExercises;
      } else if (physical_level === EActivityLevel.MODERATE && !isTargetDay5) {
        delete schedule.physicalExercises;
      }
      if (breathing_level === EActivityLevel.LIGHT && !isTargetDay3_1) {
        delete schedule.breathingExercises;
      } else if (breathing_level === EActivityLevel.MODERATE && !isTargetDay5) {
        delete schedule.breathingExercises;
      }
    }

    todayScores.forEach((score) => {
      if (schedule.physicalExercises) {
        const exercise = schedule.physicalExercises.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
      if (schedule.breathingExercises) {
        const exercise = schedule.breathingExercises.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
      if (schedule.walkingExercises && score.name === 'walking_exercise') {
        schedule.walkingExercises.completed = true;
      }
      if (schedule.physicalExercisesMorning && score.time_of_day === 'morning') {
        const exercise = schedule.physicalExercisesMorning.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
      if (schedule.physicalExercisesMidDay && score.time_of_day === 'mid_day') {
        const exercise = schedule.physicalExercisesMidDay.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
      if (schedule.breathingExercisesMorning && score.time_of_day === 'morning') {
        const exercise = schedule.breathingExercisesMorning.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
      if (schedule.breathingExercisesMidDay && score.time_of_day === 'mid_day') {
        const exercise = schedule.breathingExercisesMidDay.find((exercise) => exercise.name === score.name);
        if (exercise) exercise.completed = true;
      }
    });

    const totalExercises = [
      ...(schedule.physicalExercises || []),
      ...(schedule.breathingExercises || []),
      ...(schedule.physicalExercisesMorning || []),
      ...(schedule.physicalExercisesMidDay || []),
      ...(schedule.breathingExercisesMorning || []),
      ...(schedule.breathingExercisesMidDay || []),
    ];

    let totalCount = totalExercises.length;
    let completedCount = totalExercises.filter((exercise) => exercise.completed).length;

    if (schedule.walkingExercises) {
      totalCount++;
      if (schedule.walkingExercises.completed) {
        completedCount++;
      }
    }
    if (schedule.games) {
      totalCount++;
      if (schedule.games.completed) {
        completedCount++;
      }
    }

    const dailyProgress = Math.floor((completedCount / totalCount) * 100);

    if (dailyProgress === 100) {
      const notificationExists = await this.notificationHistoryRegisterRepository.find({
        where: {
          user: {
            id: userId,
          },
          title: ENotificationTitle.USER_COMPLETED_DAILY_ASSIGNMENT,
          date_of_email_sending: Raw((alias) => `DATE(${alias}) = CURRENT_DATE`),
        },
      });

      if (!notificationExists.length) {
        const adminsAssignedToUser = user.admins.map((el) => ({
          id: el.id,
          email_address: el.email_address,
        }));
        await this.notificationService.sendNotification(
          userId,
          ENotificationTitle.USER_COMPLETED_DAILY_ASSIGNMENT,
          ENotificationPriority.MEDIUM,
          adminsAssignedToUser,
          user.first_name + ' ' + user.last_name,
        );
      }
    }

    return createResponse(
      HttpStatus.OK,
      {
        firstName,
        schedule,
        dailyProgress,
        completedTasks: completedCount,
        totalTasks: totalCount,
        userActivitiesGroup,
      },
      this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.dashboard_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_DASHBOARD.dashboard_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getUserActivity(
    userId: number,
    exercise: EWalkingExercises | EPhysicalExercises | EBreathingExerciseType,
  ): Promise<TResponse<UserPhysicalExercises | UserBreathingExercises | UserWalkingExercises>> {
    const lang = I18nContext.current().lang;

    const userActivity = await this.userActivitiesRepository
      .createQueryBuilder('user_activity')
      .leftJoinAndSelect('user_activity.user_physical_exercises', 'user_physical_exercises')
      .leftJoin('user_physical_exercises.video', 'physical_exercise_video')
      .addSelect(['physical_exercise_video.id'])
      .leftJoinAndSelect('user_activity.user_breathing_exercises', 'user_breathing_exercises')
      .leftJoin('user_breathing_exercises.video', 'breathing_exercise_video')
      .addSelect(['breathing_exercise_video.id'])
      .leftJoinAndSelect('user_activity.user_walking_exercises', 'user_walking_exercises')
      .where('user_activity.user.id = :userId', { userId })
      .getOne();

    if (!userActivity) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITY.user_activity_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITY.user_activity_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const filteredPhysicalExercises = userActivity.user_physical_exercises.filter((el) => el.name === exercise);

    const filteredBreathingExercises = userActivity.user_breathing_exercises.filter((el) => el.name === exercise);
    const walkingExercise =
      userActivity.user_walking_exercises && exercise === 'walking_exercise'
        ? { ...userActivity.user_walking_exercises }
        : {};

    const [translatedPhysicalExercises] = this.translatePhysicalExercise(filteredPhysicalExercises);
    const [translatedBreathingExercises] = this.translateBreathingExercise(filteredBreathingExercises);

    const name = translatedPhysicalExercises?.name ?? translatedBreathingExercises?.name;
    const position = translatedPhysicalExercises?.position ?? translatedBreathingExercises?.position;
    const group = translatedPhysicalExercises ? userActivity.physical_level : userActivity.breathing_level;

    const userExerciseGroupRepetitions = await this.userExerciseGroupRepetitionsRepository.findOne({
      where: {
        name,
        position,
        group,
      },
    });

    if (!userExerciseGroupRepetitions) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.GET_USER_ACTIVITY.user_exercise_group_repetitions_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_USER_ACTIVITY.user_exercise_group_repetitions_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const { repetitions, time, times_per_day, times_per_week } = userExerciseGroupRepetitions;

    const resultExercises = {
      ...translatedPhysicalExercises,
      ...translatedBreathingExercises,
      ...walkingExercise,
      ...(exercise !== 'walking_exercise' && {
        repetitions,
        time,
        times_per_day,
        times_per_week,
      }),
    };

    return createResponse(
      HttpStatus.OK,
      resultExercises,
      this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITY.user_activity_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITY.user_activity_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async updateUserPhysicalActivitiesScores(
    userId: number,
    dto: UpdateUserPhysicalActivitiesScoresDto,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user_physical_exercises', 'user_breathing_exercises', 'user_walking_exercises'],
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.activities_not_found.notification.title`,
          { lang },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.activities_not_found.notification.message`,
          { lang },
        ),
      );
    }

    const breathingLevel = userActivities.breathing_level;
    const physicalLevel = userActivities.physical_level;

    const userAssessmentScore = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: { id: userId },
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    const userActivitiesGroup = userAssessmentScore.physical_activities_group;

    if (userActivitiesGroup !== EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES) {
      dto.time_of_day = undefined;
    } else {
      if (
        breathingLevel === EActivityLevel.INTENSE &&
        userActivities.user_breathing_exercises.some((exercise) => exercise.name === dto.name)
      ) {
        if (!('time_of_day' in dto)) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.time_of_day_required_breathing.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.time_of_day_required_breathing.notification.message`,
              {
                lang,
              },
            ),
          );
        }
      } else if (
        physicalLevel === EActivityLevel.INTENSE &&
        userActivities.user_physical_exercises.some((exercise) => exercise.name === dto.name)
      ) {
        if (!('time_of_day' in dto)) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.time_of_day_required_physical.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.time_of_day_required_physical.notification.message`,
              {
                lang,
              },
            ),
          );
        }
      } else {
        dto.time_of_day = undefined;
      }
    }

    const physicalExercises = userActivities.user_physical_exercises.map((el) => el.name);
    const breathingExercises = userActivities.user_breathing_exercises.map((el) => el.name);
    const walkingExercises = userActivities.user_walking_exercises ? ['walking_exercise'] : [];

    const mergedExercises = [...physicalExercises, ...breathingExercises, ...walkingExercises];

    if (!mergedExercises.includes(dto.name)) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.invalid_activity.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.invalid_activity.notification.message`,
          {
            lang,
            args: { activity: dto.name, acceptedActivities: mergedExercises.join(', ') },
          },
        ),
      );
    }

    const score = new UserPhysicalActivitiesScores();
    Object.assign(score, { ...dto, userActivities });

    await this.userPhysicalActivitiesRepository.save(score);

    const dashboard = (await this.getDashboard(userId)).details as TUserDashboard;

    const allExercisesCompleted = this.checkIfAllExercisesIsCompleted(dashboard, userActivitiesGroup, physicalLevel);

    if (allExercisesCompleted) {
      await this.updateBrainPoints(userId, { points: 50 });
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.activities_updated.notification.title`,
        { lang },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.UPDATE_USER_PHYSICAL_ACTIVITIES_SCORES.activities_updated.notification.message`,
        { lang },
      ),
    );
  }

  async getDayStreakTrophy(userId: number): Promise<TResponse<number>> {
    const lang = I18nContext.current().lang;
    const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate();
    const streak = await this.calculateDayStreak(userId, yesterday);

    return createResponse(
      HttpStatus.OK,
      streak,
      this.i18n.t(`${TUserResponseKey}.service.GET_DAY_STREAK_TROPHY.day_streak.notification.title`, { lang }),
      this.i18n.t(`${TUserResponseKey}.service.GET_DAY_STREAK_TROPHY.day_streak.notification.message`, {
        lang,
        args: { streak },
      }),
    );
  }

  async getUserCompletedActivities(userId: number): Promise<TResponse<TUserCompletedActivities>> {
    const lang = I18nContext.current().lang;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        'user_physical_exercises',
        'user_breathing_exercises',
        'user_walking_exercises',
        'user_physical_activities_scores',
      ],
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.GET_USER_COMPLETED_ACTIVITIES.user_completed_activities_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_USER_COMPLETED_ACTIVITIES.user_completed_activities_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const scores = await this.scoreRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        created_at: Between(startOfToday, endOfToday),
      },
    });

    const {
      user_physical_exercises,
      user_breathing_exercises,
      user_walking_exercises,
      user_physical_activities_scores,
      physical_level,
    } = userActivities;
    const physicalExercises = user_physical_exercises.map((el) => el.name);
    const breathingExercises = user_breathing_exercises.map((el) => el.name);

    const physicalActivitiesToDo = [
      ...breathingExercises,
      ...(physical_level === EActivityLevel.INTENSE
        ? [
            ...physicalExercises.map((exercise) => `${exercise}.morning`),
            ...physicalExercises.map((exercise) => `${exercise}.mid_day`),
          ]
        : [...physicalExercises]),
      user_walking_exercises && 'walking_exercise',
    ].filter(Boolean);

    const todayPhysicalActivitiesScores = user_physical_activities_scores.filter((score) => {
      const createdAt = new Date(score.created_at);
      return createdAt >= startOfToday && createdAt <= endOfToday;
    });

    const completedPhysicalActivities = todayPhysicalActivitiesScores.map((el) => {
      if (el.time_of_day) {
        return `${el.name}.${el.time_of_day}`;
      }
      return el.name;
    });

    const mergedActivities = physicalActivitiesToDo.map((activity) => ({
      name: activity,
      completed: completedPhysicalActivities.includes(activity),
    }));

    mergedActivities.push({
      name: 'game_completed',
      completed: scores !== null,
    });

    const totalActivities = mergedActivities.length;
    const completedActivities = mergedActivities.filter((activity) => activity.completed).length;

    const response = {
      activities: mergedActivities,
      totalActivities,
      completedActivities,
    };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(
        `${TUserResponseKey}.service.GET_USER_COMPLETED_ACTIVITIES.user_completed_activities_fetched.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.GET_USER_COMPLETED_ACTIVITIES.user_completed_activities_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async updateUserFeedback(
    userId: number,
    personalGrowthId: number,
    updateUserFeedbackDto: UpdateUserFeedbackDto,
  ): Promise<TResponse<null>> {
    const lang = I18nContext.current().lang;
    const userPersonalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        id: personalGrowthId,
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (!userPersonalGrowth) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TUserResponseKey}.service.UPDATE_USER_FEEDBACK.feedback_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.UPDATE_USER_FEEDBACK.feedback_not_found.notification.message`, {
          lang,
        }),
      );
    }

    Object.assign(userPersonalGrowth, updateUserFeedbackDto);
    await this.userPersonalGrowthRepository.save(userPersonalGrowth);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TUserResponseKey}.service.UPDATE_USER_FEEDBACK.feedback_updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.UPDATE_USER_FEEDBACK.feedback_updated.notification.message`, {
        lang,
      }),
    );
  }

  async setPersonalGrowthChallengeToActive(userId: number, personalGrowthId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const challenge = await this.userPersonalGrowthRepository.findOne({
      where: {
        id: personalGrowthId,
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (!challenge) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_ACTIVE.challenge_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_ACTIVE.challenge_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.userPersonalGrowthRepository.update(personalGrowthId, { active: true });

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_ACTIVE.challenge_marked_as_active.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_ACTIVE.challenge_marked_as_active.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async setPersonalGrowthChallengeToCompleted(
    userId: number,
    personalGrowthId: number,
    updateUserFeedbackDto: UpdateUserFeedbackDto,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userPersonalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        id: personalGrowthId,
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (!userPersonalGrowth) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.challenge_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.challenge_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (!userPersonalGrowth.active || userPersonalGrowth.completed) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.active_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.active_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.userPersonalGrowthRepository.update(personalGrowthId, {
      ...updateUserFeedbackDto,
      completed: true,
      active: false,
    });

    const allGrowthChallenges = await this.userPersonalGrowthChallengesRepository.find();
    const userGrowthChallenges = await this.userPersonalGrowthRepository.find({
      where: {
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['user_personal_growth_challenges'],
    });

    const unassignedChallenges = allGrowthChallenges.filter(
      (challenge) =>
        !userGrowthChallenges.some((userChallenge) => {
          return userChallenge.user_personal_growth_challenges.id === challenge.id;
        }),
    );

    if (unassignedChallenges.length > 0) {
      const nextChallenge = unassignedChallenges[0];
      const userActivities = await this.userActivitiesRepository.findOne({ where: { user: { id: userId } } });

      const newUserPersonalGrowth = new UserPersonalGrowth();
      Object.assign(newUserPersonalGrowth, {
        userActivities,
        user_personal_growth_challenges: nextChallenge,
        active: true,
        completed: false,
      });

      await this.userPersonalGrowthRepository.save(newUserPersonalGrowth);
    } else {
      const nextChallenge = userGrowthChallenges.find((challenge) => !challenge.completed && !challenge.active);

      if (nextChallenge) {
        await this.userPersonalGrowthRepository.update(nextChallenge.id, {
          active: true,
        });
      }
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.challenge_marked_as_completed.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.SET_PERSONAL_GROWTH_CHALLENGE_TO_COMPLETED.challenge_marked_as_completed.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getCompletedPersonalGrowthChallenges(userId: number): Promise<TResponse<UserPersonalGrowth[]>> {
    const lang = I18nContext.current().lang;

    const completedActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        user_personal_growth: {
          completed: true,
        },
      },
      relations: ['user_personal_growth', 'user_personal_growth.user_personal_growth_challenges'],
    });

    if (!completedActivities) {
      return createResponse(
        HttpStatus.OK,
        [],
        this.i18n.t(
          `${TUserResponseKey}.service.GET_COMPLETED_PERSONAL_GROWTH_CHALLENGES.completed_challenges_fetched.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_COMPLETED_PERSONAL_GROWTH_CHALLENGES.completed_challenges_fetched.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const completedPersonalGrowth = completedActivities.user_personal_growth;
    const translatedPersonalGrowthChallenges = this.translatePersonalGrowthChallenges(completedPersonalGrowth);

    return createResponse(
      HttpStatus.OK,
      translatedPersonalGrowthChallenges,
      this.i18n.t(
        `${TUserResponseKey}.service.GET_COMPLETED_PERSONAL_GROWTH_CHALLENGES.completed_challenges_fetched.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.GET_COMPLETED_PERSONAL_GROWTH_CHALLENGES.completed_challenges_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async skipChallenge(userId: number, personalGrowthId: number): Promise<TResponse<null>> {
    const lang = I18nContext.current().lang;
    const activePersonalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        id: personalGrowthId,
        userActivities: { user: { id: userId } },
        active: true,
      },
      relations: ['userActivities', 'user_personal_growth_challenges'],
    });

    if (!activePersonalGrowth) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.challenge_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.challenge_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const nextChallenge = await this.findNextChallenge(userId, activePersonalGrowth.user_personal_growth_challenges.id);

    if (!nextChallenge) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.cannot_skip.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.cannot_skip.notification.message`, {
          lang,
        }),
      );
    }

    let nextPersonalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        userActivities: { user: { id: userId } },
        user_personal_growth_challenges: { id: nextChallenge.id },
      },
    });

    if (!nextPersonalGrowth) {
      nextPersonalGrowth = new UserPersonalGrowth();
      Object.assign(nextPersonalGrowth, {
        userActivities: activePersonalGrowth.userActivities,
        user_personal_growth_challenges: nextChallenge,
        active: true,
        completed: false,
      });
    } else {
      nextPersonalGrowth.active = true;
    }

    activePersonalGrowth.active = false;
    await this.userPersonalGrowthRepository.save(activePersonalGrowth);
    await this.userPersonalGrowthRepository.save(nextPersonalGrowth);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.skipped.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.SKIP_CHALLENGE.skipped.notification.message`, {
        lang,
      }),
    );
  }

  async getPersonalGrowthChallenge(userId: number, personalGrowthId: number): Promise<TResponse<UserPersonalGrowth>> {
    const lang = I18nContext.current().lang;

    const userPersonalGrowth = await this.userPersonalGrowthRepository.findOne({
      where: {
        id: personalGrowthId,
        userActivities: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['user_personal_growth_challenges'],
    });

    if (!userPersonalGrowth) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.GET_PERSONAL_GROWTH_CHALLENGE.challenge_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_PERSONAL_GROWTH_CHALLENGE.challenge_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const [translatedUserPersonalGrowth] = this.translatePersonalGrowthChallenges([userPersonalGrowth]);

    return createResponse(
      HttpStatus.OK,
      translatedUserPersonalGrowth,
      this.i18n.t(`${TUserResponseKey}.service.GET_PERSONAL_GROWTH_CHALLENGE.challenge_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_PERSONAL_GROWTH_CHALLENGE.challenge_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getActivePersonalGrowthChallenge(userId: number): Promise<TResponse<UserPersonalGrowth | null>> {
    const lang = I18nContext.current().lang;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user_personal_growth', 'user_personal_growth.user_personal_growth_challenges'],
    });

    if (!userActivities || !userActivities.user_personal_growth) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.user_activities_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.user_activities_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    const createFetchedChallengeResponse = (
      personalGrowthChallenge: UserPersonalGrowth | null,
    ): TResponse<UserPersonalGrowth> => {
      if (!personalGrowthChallenge) {
        return createResponse(
          HttpStatus.OK,
          null,
          this.i18n.t(
            `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.no_more_challenges.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.no_more_challenges.notification.message`,
            {
              lang,
            },
          ),
        );
      }
      const [translatedPersonalChallenge] = this.translatePersonalGrowthChallenges([personalGrowthChallenge]);

      return createResponse(
        HttpStatus.OK,
        translatedPersonalChallenge || null,
        this.i18n.t(
          `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.challenge_fetched.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.GET_ACTIVE_PERSONAL_GROWTH_CHALLENGE.challenge_fetched.notification.message`,
          {
            lang,
          },
        ),
      );
    };

    const createPersonalGrowthChallenge = async (
      personalGrowthChallenges: UserPersonalGrowthChallenges[],
    ): Promise<TResponse<UserPersonalGrowth>> => {
      const initialPersonalChallenge = new UserPersonalGrowth();

      Object.assign(initialPersonalChallenge, {
        active: true,
        userActivities,
        user_personal_growth_challenges: personalGrowthChallenges[0],
      });

      await this.userPersonalGrowthRepository.save(initialPersonalChallenge);

      delete initialPersonalChallenge.userActivities;

      return createFetchedChallengeResponse(initialPersonalChallenge);
    };

    if (!userActivities.user_personal_growth.length) {
      const userPersonalGrowthChallenges = await this.userPersonalGrowthChallengesRepository.find({
        order: { created_at: 'ASC' },
      });

      const initialPersonalChallenge = await createPersonalGrowthChallenge(userPersonalGrowthChallenges);

      return initialPersonalChallenge;
    }

    const allPersonalGrowthChallenges = await this.userPersonalGrowthChallengesRepository.find({});
    const personalGrowthChallenge = userActivities.user_personal_growth.find((challenge) => challenge.active);

    if (!personalGrowthChallenge && allPersonalGrowthChallenges.length > userActivities.user_personal_growth.length) {
      const userPersonalGrowthChallenges = userActivities.user_personal_growth.map(
        (challenge) => challenge.user_personal_growth_challenges,
      );

      const newPersonalGrowthChallenge = allPersonalGrowthChallenges.filter(
        (challenge) => !userPersonalGrowthChallenges.some((userChallenge) => userChallenge.id === challenge.id),
      );

      const createNewPersonalGrowthChallenge = await createPersonalGrowthChallenge(newPersonalGrowthChallenge);
      return createNewPersonalGrowthChallenge;
    }

    return createFetchedChallengeResponse(personalGrowthChallenge || null);
  }

  async canSkipChallenge(userId: number): Promise<TResponse<boolean>> {
    const lang = I18nContext.current().lang;
    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user_personal_growth', 'user_personal_growth.user_personal_growth_challenges'],
    });

    if (!userActivities || !userActivities.user_personal_growth) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.activities_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.activities_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const allChallenges = await this.userPersonalGrowthChallengesRepository.find();
    const userChallenges = userActivities.user_personal_growth.map((growth) => ({
      id: growth.user_personal_growth_challenges.id,
      completed: growth.completed,
    }));

    const completedChallengesCount = userChallenges.filter((challenge) => challenge.completed).length;
    const notCompletedChallengesCount = allChallenges.length - completedChallengesCount;

    if (notCompletedChallengesCount <= 1) {
      return createResponse(
        HttpStatus.OK,
        false,
        this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.can_skip.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.can_skip.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.OK,
      true,
      this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.can_skip.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.CAN_SKIP_CHALLENGE.can_skip.notification.message`, {
        lang,
      }),
    );
  }

  async addGameFeedbackIncreasedDifficultyLevel(
    userId: number,
    { game_name, rating, feedback }: AddGameFeedbackIncreasedDifficultyLevel,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.activities_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.activities_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    let difficultyFeedback;

    if (feedback) {
      difficultyFeedback = await this.userDifficultyFeedbackRepository.find({
        where: {
          feedback: In(feedback),
        },
      });

      if (feedback.length !== difficultyFeedback.length) {
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(
            `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.difficulty_feedback_not_found.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.difficulty_feedback_not_found.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    const gamesFeedback = new UserGamesFeedback();
    Object.assign(gamesFeedback, {
      game_name,
      feedback_type: EFeedbackType.INCREASED_DIFFICULTY_LEVEL,
      rating,
      user_difficulty_feedback: difficultyFeedback,
      userActivities,
    });

    await this.userGamesFeedbackRepository.save(gamesFeedback);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(
        `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_INCREASED_DIFFICULTY_LEVEL.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async addGameFeedbackClosingGameBeforeCompletion(
    userId: number,
    { game_name, feedback }: AddGameFeedbackClosingGameBeforeCompletion,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.activities_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.activities_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const experienceFeedback = await this.userGamesExperienceFeedbackRepository.find({
      where: {
        feedback: In(feedback),
      },
    });

    if (feedback.length !== experienceFeedback.length) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.experience_feedback_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.experience_feedback_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const gamesFeedback = new UserGamesFeedback();
    Object.assign(gamesFeedback, {
      game_name,
      feedback_type: EFeedbackType.CLOSING_GAME_BEFORE_COMPLETION,
      user_games_experience_feedback: experienceFeedback,
      userActivities,
    });

    await this.userGamesFeedbackRepository.save(gamesFeedback);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(
        `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserResponseKey}.service.ADD_GAME_FEEDBACK_CLOSING_GAME_BEFORE_COMPLETION.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getGameFeedbackDisplayOptions(
    userId: number,
    game_name: EGame,
  ): Promise<TResponse<GetGameFeedbackDisplayOptions>> {
    const lang = I18nContext.current().lang;

    const scores = await this.scoreRepository.find({
      where: {
        user: {
          id: userId,
        },
        game_name,
      },
      order: { created_at: 'DESC' },
    });

    const response = {
      second_loss_in_a_game: false,
      increased_difficulty_level: false,
    };

    if (scores.length >= 2) {
      const [mostRecentScore, secondMostRecentScore] = scores;

      if (mostRecentScore.game_level > secondMostRecentScore.game_level) {
        response.increased_difficulty_level = true;
      }

      if (!mostRecentScore.completed && !secondMostRecentScore.completed) {
        response.second_loss_in_a_game = true;
      }
    }

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TUserResponseKey}.service.GET_FEEDBACK_DISPLAY_OPTIONS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_FEEDBACK_DISPLAY_OPTIONS.success.notification.message`, {
        lang,
      }),
    );
  }

  async addGameFeedbackAfterSecondLoss(
    userId: number,
    { game_name, feedback }: AddGameFeedbackAfterSecondLoss,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userActivities) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.activities_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.activities_not_found.notification.message`, {
          lang,
        }),
      );
    }

    let experienceFeedback;

    if (feedback) {
      experienceFeedback = await this.userGamesExperienceFeedbackRepository.find({
        where: {
          feedback: In(feedback),
        },
      });

      if (feedback.length !== experienceFeedback.length) {
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(
            `${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.experience_feedback_not_found.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.experience_feedback_not_found.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    const gamesFeedback = new UserGamesFeedback();
    Object.assign(gamesFeedback, {
      game_name,
      feedback_type: EFeedbackType.SECOND_LOSS_IN_A_GAME,
      user_games_experience_feedback: experienceFeedback,
      userActivities,
    });

    await this.userGamesFeedbackRepository.save(gamesFeedback);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.ADD_FEEDBACK_SECOND_LOSS.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateBrainPoints(userId: number, { points }: UpdateBrainPoints): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    let userBrainPoints = await this.userBrainPointsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userBrainPoints) {
      userBrainPoints = new UserBrainPoints();
      userBrainPoints.user = { id: userId } as User;
    }
    userBrainPoints.points = (userBrainPoints.points || 0) + points;

    await this.userBrainPointsRepository.save(userBrainPoints);
    await this.userRepository.update(userId, {
      lastActivity: new Date(),
    });

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TUserResponseKey}.service.UPDATE_BRAIN_POINTS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.UPDATE_BRAIN_POINTS.success.notification.message`, {
        lang,
      }),
    );
  }

  async getBrainPoints(userId: number): Promise<TResponse<number>> {
    const lang = I18nContext.current().lang;

    const userBrainPoints = await this.userBrainPointsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const points = userBrainPoints ? userBrainPoints.points : 0;

    return createResponse(
      HttpStatus.OK,
      points,
      this.i18n.t(`${TUserResponseKey}.service.GET_BRAIN_POINTS.brain_points_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_BRAIN_POINTS.brain_points_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getUserActivitiesList(
    userId: number,
    { exercise_type }: GetUserActivitiesListDto,
  ): Promise<
    TResponse<
      | TGetUserActivitiesListWalkingResponse
      | TGetUserActivitiesListPhysicalResponse
      | TGetUserActivitiesListBreathingResponse
    >
  > {
    const lang = I18nContext.current().lang;
    const dashboard = (await this.getDashboard(userId)).details as TUserDashboard;

    if (exercise_type === EUserExerciseTypes.WALKING_EXERCISES) {
      const walking = dashboard?.schedule?.walkingExercises;

      if (!walking) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.activities_not_found.notification.title`, {
            lang,
          }),
          this.i18n.t(
            `${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.activities_not_found.notification.message`,
            {
              lang,
            },
          ),
        );
      }

      const response = {
        walking: [
          {
            name: 'walking_exercise',
            completed: walking.completed,
          },
        ],
      };

      return createResponse(
        HttpStatus.OK,
        response,
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.message`, {
          lang,
        }),
      );
    }

    delete dashboard.schedule.walkingExercises;

    const exercises = dashboard.schedule[exercise_type];

    if (!exercises) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.activities_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.activities_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const exerciseNames = exercises.map((exercise) => exercise.name);

    const generateResponse = (
      userExercises: UserPhysicalExercises[] | UserBreathingExercises[],
    ): TGetUserActivitiesListGenerateResponse => {
      return userExercises.reduce((acc: TGetUserActivitiesListGenerateResponse, { name, position }) => {
        const { completed } = exercises.find(({ name: exerciseName }) => exerciseName === name) || {};
        acc[position] = acc[position] || [];
        acc[position].push({ name, completed });
        return acc;
      }, {});
    };

    if (
      exercise_type === EUserExerciseTypes.PHYSICAL_EXERCISES ||
      exercise_type === EUserExerciseTypes.PHYSICAL_EXERCISES_MID_DAY ||
      exercise_type === EUserExerciseTypes.PHYSICAL_EXERCISES_MORNING
    ) {
      const userExercises = await this.userPhysicalExercisesRepository.find({
        where: {
          name: In(exerciseNames),
        },
      });

      const response = generateResponse(userExercises);

      return createResponse(
        HttpStatus.OK,
        response,
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.message`, {
          lang,
        }),
      );
    }

    if (
      exercise_type === EUserExerciseTypes.BREATHING_EXERCISES ||
      exercise_type === EUserExerciseTypes.BREATHING_EXERCISES_MID_DAY ||
      exercise_type === EUserExerciseTypes.BREATHING_EXERCISES_MORNING
    ) {
      const userExercises = await this.userBreathingExercisesRepository.find({
        where: {
          name: In(exerciseNames),
        },
      });

      const response = generateResponse(userExercises);

      return createResponse(
        HttpStatus.OK,
        response,
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserResponseKey}.service.GET_USER_ACTIVITIES_LIST.success.notification.message`, {
          lang,
        }),
      );
    }
  }
  async getLang(userId: number): Promise<TResponse<{ language: ELanguage }>> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['admins.country'],
    });
    const adminWithCountryCode = user?.admins.find((admin) => admin.country && admin.country.country_code);
    const language = adminWithCountryCode?.country?.country_code || ELanguage.ENGLISH;

    return createResponse(
      HttpStatus.OK,
      { language },
      this.i18n.t(`${TUserResponseKey}.service.GET_LANG.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserResponseKey}.service.GET_LANG.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateUserDate(userId: number, date: string): Promise<TResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }

    const dateParts = date.split('-');

    if (dateParts.length !== 3) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Invalid date format, expected YYYY-MM-DD');
    }

    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const parsedDate = new Date(Date.UTC(year, month, day, 0, 0, 0));

    if (isNaN(parsedDate.getTime())) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Invalid date provided');
    }

    user.created_at = parsedDate;

    await this.userRepository.save(user);

    return createResponse(HttpStatus.OK, null, 'Date updated successfully');
  }

  checkIfAllExercisesIsCompleted(
    userData: TUserDashboard,
    userActivitiesGroup: EUserPhysicalActivityGroup,
    physicalLevel: EActivityLevel,
  ): boolean {
    if (
      userActivitiesGroup !== EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES ||
      (userActivitiesGroup === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES &&
        physicalLevel !== EActivityLevel.INTENSE)
    ) {
      return (
        (userData?.schedule?.physicalExercises?.every((exercise) => exercise.completed) ?? true) &&
        (userData?.schedule?.breathingExercises?.every((exercise) => exercise.completed) ?? true) &&
        (userData?.schedule?.walkingExercises?.completed ?? true)
      );
    } else if (
      userActivitiesGroup === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES &&
      physicalLevel === EActivityLevel.INTENSE
    ) {
      const allMorningExercisesCompleted =
        (userData?.schedule?.physicalExercisesMorning?.every((exercise) => exercise.completed) ?? true) &&
        (userData?.schedule?.breathingExercisesMorning?.every((exercise) => exercise.completed) ?? true);
      const allMidDayExercisesCompleted =
        (userData?.schedule?.physicalExercisesMidDay?.every((exercise) => exercise.completed) ?? true) &&
        (userData?.schedule?.breathingExercisesMidDay?.every((exercise) => exercise.completed) ?? true);
      return (
        allMorningExercisesCompleted &&
        allMidDayExercisesCompleted &&
        (userData?.schedule?.walkingExercises?.completed ?? true)
      );
    }
  }
}
