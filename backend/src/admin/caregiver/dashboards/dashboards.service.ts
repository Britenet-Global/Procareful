import { HttpStatus, Injectable } from '@nestjs/common';
import { createResponse } from '../../../common/responses/createResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from '../../../user/games/entities';
import { Between, In, Repository } from 'typeorm';
import { ESortOrder, TResponse } from '../../../common/types';
import {
  DashboardInstitutionView,
  IUserRetrievalStrategy,
  TGamesScoresPerUser,
  TGetGamesEngagement,
  TGroupedResults,
  TPersonalGrowthPerformance,
  TSeniorsPerformance,
  TUserActivity,
} from './types';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AdminService } from 'src/admin/admin.service';
import { ERole } from 'src/admin/types';
import { TCommonResponseKey, TDashboardsResponseKey } from '../../../common/utils/translationKeys';
import { User } from '../../../user/entities/user.entity';
import { AdminInstitutionService } from '../../admin-institution/admin-institution.service';
import { Admin } from '../../entities';
import {
  EActivityLevel,
  EBreathingExerciseType,
  ECaregiverRole,
  EPhysicalExercises,
  EUserPhysicalActivityGroup,
  EWalkingExercises,
  TPhysicalActivityCompletedPercentage,
} from '../types';
import { EGame } from '../../../user/games/types';
import { EditCarePlanReasonDto } from '../dto';
import { UserAssessment } from '../entities/userAssessment.entity';
import { NestedPaginationParamsDto } from '../../../common/dto/pagination-params.dto';
import { createPaginatedResponse } from '../../../common/responses/createPaginatedResponse';
import { UserActivities } from '../entities/userActivities.entity';
import { UserPersonalGrowth } from '../../../user/entities/userPersonalGrowth.entity';
import { UserConditionAssessmentScores } from '../entities/userConditionAssesmentScores.entity';
import { UserPersonalGrowthChallenges } from 'src/user/entities/userPersonalGrowthChallenges.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class DashboardsService {
  constructor(
    private readonly adminService: AdminService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,

    @InjectRepository(UserAssessment)
    private readonly userAssessmentRepository: Repository<UserAssessment>,

    @InjectRepository(UserActivities)
    private readonly userActivitiesRepository: Repository<UserActivities>,

    @InjectRepository(UserPersonalGrowth)
    private readonly userPersonalGrowthRepository: Repository<UserPersonalGrowth>,

    @InjectRepository(UserConditionAssessmentScores)
    private readonly userConditionAssessmentScoresRepository: Repository<UserConditionAssessmentScores>,

    @InjectRepository(UserPersonalGrowthChallenges)
    private readonly userPersonalGrowthChallenges: Repository<UserPersonalGrowthChallenges>,

    private readonly i18n: I18nService,

    private readonly adminInstitutionService: AdminInstitutionService,
  ) {}

  private getDateRange = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  async getCognitiveGamesEngagement(
    caregiverId: number,
    paginationParams?: NestedPaginationParamsDto,
    seniorId?: number,
  ): Promise<TResponse<TGetGamesEngagement>> {
    const lang = I18nContext.current().lang;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const { page = 1, pageSize = 10 } = paginationParams || {};

    const allUsers = await this.userRepository.find({
      where: {
        admins: {
          id: caregiverId,
        },
      },
      relations: ['admins', 'scores'],
    });

    if (!allUsers || allUsers.length === 0 || (seniorId && !allUsers.find((user) => user.id === +seniorId))) {
      return createResponse(
        HttpStatus.OK,
        {
          averageDailyGameTime: 0,
          mostPlayedGame: [],
          leastPlayedGame: [],
          gamesScores: createPaginatedResponse([], { page, pageSize }, 0),
        },
        this.i18n.t(`${TCommonResponseKey}.users_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TCommonResponseKey}.users_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const groupedResults: TGroupedResults = {};

    allUsers.forEach((user) => {
      const userId = user.id;
      const firstName = user.first_name;
      const lastName = user.last_name;

      const actualStartDate = user.created_at > startDate ? user.created_at : startDate;
      const actualDateRange = this.getDateRange(actualStartDate, endDate);
      const daysCount = actualDateRange.length;

      groupedResults[userId] = {
        firstName,
        lastName,
        dates: {},
        games: {},
        daysCount,
      };

      const fullDateRange = this.getDateRange(startDate, endDate);
      fullDateRange.forEach((date) => {
        groupedResults[userId].dates[date] = 0;
      });

      user.scores.forEach((score) => {
        const date = score.created_at.toISOString().split('T')[0];

        if (score.created_at >= startDate && score.created_at <= endDate) {
          if (!groupedResults[userId].games[score.game_name]) {
            groupedResults[userId].games[score.game_name] = 0;
          }

          groupedResults[userId].dates[date] += score.completion_time;
          groupedResults[userId].games[score.game_name] += score.completion_time;
        }
      });
    });

    let totalAverageDailyTimeSum = 0;
    let totalCount = 0;
    const gamesTime: { [gameName: string]: number } = {};

    const allGamesScores: TGamesScoresPerUser[] = Object.entries(groupedResults).map(([userId, userInfo]) => {
      const scores = this.getDateRange(startDate, endDate).map((date) => ({
        date,
        totalTime: userInfo.dates[date] || 0,
      }));

      const totalTime = scores.reduce((sum, { totalTime }) => sum + totalTime, 0);
      const averageDailyTime = Math.round(totalTime / userInfo.daysCount);

      totalAverageDailyTimeSum += averageDailyTime;
      totalCount++;

      Object.entries(userInfo.games).forEach(([gameName, time]) => {
        if (!gamesTime[gameName]) {
          gamesTime[gameName] = 0;
        }
        gamesTime[gameName] += time;
      });

      return {
        userId: +userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        userMostPlayedGame:
          Object.entries(userInfo.games).reduce((prev, next) => (prev[1] > next[1] ? prev : next), [])[0] || null,
        userLeastPlayedGame:
          (Object.entries(userInfo.games).length > 1 &&
            Object.entries(userInfo.games).reduce((prev, next) => (prev[1] < next[1] ? prev : next), [])[0]) ||
          null,
        averageDailyTime,
        scores,
      };
    });

    const averageDailyGameTime = Math.round(totalAverageDailyTimeSum / totalCount);

    Object.values(EGame).forEach((gameName) => {
      if (!gamesTime[gameName]) {
        gamesTime[gameName] = 0;
      }
    });

    const mostEngagedTime = Math.max(...Object.values(gamesTime));
    const leastEngagedTime = Math.min(...Object.values(gamesTime));

    const mostPlayedGame =
      allGamesScores.length === 0
        ? null
        : Object.entries(gamesTime)
            .filter(([, time]) => time === mostEngagedTime && mostEngagedTime > 0)
            .map(([gameName]) => gameName);

    const leastPlayedGame =
      allGamesScores.length === 0
        ? null
        : Object.entries(gamesTime)
            .filter(([, time]) => time === leastEngagedTime && leastEngagedTime > 0)
            .map(([gameName]) => gameName);

    const filteredGamesScores = seniorId ? allGamesScores.filter((user) => user.userId === +seniorId) : allGamesScores;
    const sortedGamesScores = filteredGamesScores.sort((a, b) => b.averageDailyTime - a.averageDailyTime);
    const paginatedGamesScores = sortedGamesScores.slice((page - 1) * pageSize, page * pageSize);

    const response = {
      averageDailyGameTime,
      mostPlayedGame,
      leastPlayedGame,
      gamesScores: createPaginatedResponse(paginatedGamesScores, { page, pageSize }, filteredGamesScores.length),
    };

    if (!paginationParams) {
      delete response.gamesScores.pagination;
    }

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_DASHBOARD_GAMES_ENGAGEMENT.engagement_retrieved.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_DASHBOARD_GAMES_ENGAGEMENT.engagement_retrieved.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getDashboardInsitutionView(
    userId: number,
    sortOrder: ESortOrder,
  ): Promise<TResponse<DashboardInstitutionView>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const caregivers = await this.adminRepository.find({
      where: {
        institution: {
          id: loggedInAdmin.institution.id,
        },
        roles: {
          role_name: In([ERole.INFORMAL_CAREGIVER, ERole.FORMAL_CAREGIVER]),
        },
      },
      relations: ['users', 'roles', 'caregiver_roles'],
    });

    if (!caregivers) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TDashboardsResponseKey}.service.GET_DASHBOARD_INSTITUTION_VIEW.caregivers_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TDashboardsResponseKey}.service.GET_DASHBOARD_INSTITUTION_VIEW.caregivers_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const users = await this.userRepository.find({
      where: {
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
    });

    const seniorCount = users?.length | 0;
    const informalCaregiverCount = caregivers.filter((caregiver) =>
      caregiver?.roles?.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
    ).length;
    const formalCaregiverCount = caregivers.filter((caregiver) =>
      caregiver?.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER),
    ).length;

    const initialRoles = Object.values(ECaregiverRole).reduce(
      (acc, role) => {
        acc[role] = 0;
        return acc;
      },
      {} as Record<ECaregiverRole, number>,
    );

    const formalCaregiverData = caregivers.reduce(
      (acc, caregiver) => {
        const isFormalCaregiver = caregiver?.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

        if (isFormalCaregiver) {
          caregiver?.caregiver_roles?.forEach((role) => {
            acc.roles[role.role_name] = (acc.roles[role.role_name] || 0) + 1;
          });

          const seniorCount = caregiver?.users?.length | 0;

          acc.caregivers.push({
            id: caregiver.id,
            seniorCount,
            imageName: caregiver.image_name,
            name: `${caregiver.first_name} ${caregiver.last_name}`,
          });
        }

        return acc;
      },
      {
        roles: initialRoles,
        caregivers: [] as { id: number; seniorCount: number; imageName: string; name: string }[],
      },
    );

    const sortedCaregiversWorkload = formalCaregiverData.caregivers.sort((a, b) => {
      if (sortOrder === ESortOrder.ASC) {
        return a.seniorCount - b.seniorCount;
      } else {
        return b.seniorCount - a.seniorCount;
      }
    });

    const caregiversWorkloadWithImage = await Promise.all(
      sortedCaregiversWorkload.map(async (data) => {
        const { details } = await this.adminInstitutionService.getImage(data.id, Admin);
        const image = typeof details === 'string' ? details : null;
        return { ...data, image };
      }),
    );

    const response = {
      seniors: seniorCount,
      informalCaregivers: informalCaregiverCount,
      formalCaregivers: formalCaregiverCount,
      rolesDistribution: formalCaregiverData.roles,
      caregiversWorkload: caregiversWorkloadWithImage,
    };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_DASHBOARD_INSTITUTION_VIEW.dashboard_fetched.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_DASHBOARD_INSTITUTION_VIEW.dashboard_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getMostActiveSeniors(
    adminId: number,
    sortOrder: ESortOrder,
    userRetrievalStrategy: IUserRetrievalStrategy,
  ): Promise<TResponse<TUserActivity[]>> {
    const lang = I18nContext.current().lang;

    const users = await userRetrievalStrategy.retrieveUsers(adminId);

    if (!users || users.length === 0) {
      return createResponse(
        HttpStatus.OK,
        [],
        this.i18n.t(`${TCommonResponseKey}.users_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TCommonResponseKey}.users_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const userActivities = await Promise.all(
      users.map(async (user) => {
        const performance = (await this.getUserPerformance(user.id)).details as TSeniorsPerformance;
        const { details } = await this.adminInstitutionService.getImage(user.id, User);
        const image = typeof details === 'string' ? details : null;

        return {
          id: user.id,
          avatar: image,
          fullName: `${user.first_name} ${user.last_name}`,
          completionRate: performance?.totalPerformance || 0,
        };
      }),
    );

    if (sortOrder === ESortOrder.ASC) {
      userActivities.sort((a, b) => b.completionRate - a.completionRate);
    } else {
      userActivities.sort((a, b) => a.completionRate - b.completionRate);
    }

    return createResponse(
      HttpStatus.OK,
      userActivities,
      this.i18n.t(`${TDashboardsResponseKey}.service.GET_MOST_ACTIVE_SENIORS.users_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TDashboardsResponseKey}.service.GET_MOST_ACTIVE_SENIORS.users_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getUserPerformance(seniorId: number, caregiverId?: number): Promise<TResponse<TSeniorsPerformance>> {
    const i18nContext = I18nContext.current();
    const lang = i18nContext?.lang || 'en';

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        ...(caregiverId && { admins: { id: caregiverId } }),
      },
      relations: ['userActivities'],
    });

    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate.setHours(0, 0, 0, 0);

    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const activityStartDate = new Date(user?.userActivities?.start_date) || new Date();
    activityStartDate.setDate(activityStartDate.getDate());
    activityStartDate.setHours(0, 0, 0, 0);

    const daysFromPlanStart = dayjs(endDate).diff(dayjs(activityStartDate), 'day');
    const daysFromPlanStartLessThen30DaysAgo = daysFromPlanStart < 30;
    const daysForPercentCalc = daysFromPlanStartLessThen30DaysAgo ? daysFromPlanStart : 30;
    if (daysFromPlanStartLessThen30DaysAgo) {
      startDate = activityStartDate;
    }

    if (!user?.userActivities) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(`${TDashboardsResponseKey}.service.GET_USER_PERFORMANCE.no_schedule.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TDashboardsResponseKey}.service.GET_USER_PERFORMANCE.no_schedule.notification.message`, {
          lang,
        }),
      );
    }

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const gamesResults = await this.scoreRepository.find({
      where: {
        user: { id: seniorId, ...(caregiverId && { admins: { id: caregiverId } }) },
        created_at: Between(startDate, endDate),
      },
    });

    const uniqueDays = new Set<string>();

    gamesResults.forEach((result) => {
      const date = new Date(result.created_at);
      const dateString = date.toISOString().split('T')[0];
      uniqueDays.add(dateString);
    });

    const daysWithResultsCount = uniqueDays.size;
    const gamesEngagement = daysWithResultsCount ? Math.round((daysWithResultsCount / daysForPercentCalc) * 100) : 0;
    const gamesToDo = 1;

    const physicalActivityPerformance = await this.getPhysicalActivityPerformance(seniorId, caregiverId).then(
      (res) => res.details,
    );
    const { overalPhysicalActivityPerformancePercentage, totalExercisesToDo } = physicalActivityPerformance as {
      overalPhysicalActivityPerformancePercentage: number;
      totalExercisesDone: number;
      totalExercisesToDo: number;
    };
    const personalGrowth = await this.getPersonalGrowthPerformance(caregiverId, seniorId);
    const totalAmountActivitiesToDo = totalExercisesToDo + gamesToDo;
    const totalPerformance = totalAmountActivitiesToDo
      ? Math.round((gamesEngagement + overalPhysicalActivityPerformancePercentage) / 2)
      : 0;

    const response = {
      cognitiveGames: gamesEngagement,
      physicalActivity: overalPhysicalActivityPerformancePercentage,
      personalGrowth,
      totalPerformance,
      assignedCarePlan: !!user?.userActivities && activityStartDate < endDate,
    };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TDashboardsResponseKey}.service.GET_USER_PERFORMANCE.performance_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TDashboardsResponseKey}.service.GET_USER_PERFORMANCE.performance_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async editCarePlanReason(
    caregiverId: number,
    seniorId: number,
    { edit_care_plan_reason }: EditCarePlanReasonDto,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const assessment = await this.userAssessmentRepository.findOne({
      where: {
        users: {
          id: seniorId,
          admins: {
            id: caregiverId,
          },
        },
      },
    });

    if (!assessment) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TDashboardsResponseKey}.service.EDIT_CARE_PLAN_REASON.assessment_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TDashboardsResponseKey}.service.EDIT_CARE_PLAN_REASON.assessment_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    assessment.edit_care_plan_reason = edit_care_plan_reason;

    await this.userAssessmentRepository.save(assessment);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TDashboardsResponseKey}.service.EDIT_CARE_PLAN_REASON.care_plan_reason_updated.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TDashboardsResponseKey}.service.EDIT_CARE_PLAN_REASON.care_plan_reason_updated.notification.message`,
        {
          lang,
        },
      ),
    );
  }
  async getPersonalGrowthPerformance(caregiverId: number, seniorId: number): Promise<TPersonalGrowthPerformance> {
    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: seniorId,
          admins: { id: caregiverId },
        },
      },
    });
    const { personal_growth } = userActivities;

    if (!personal_growth) {
      return null;
    }

    const personalGrowthEngagement = await this.userPersonalGrowthRepository.find({
      where: {
        userActivities: {
          user: {
            id: seniorId,
            admins: { id: caregiverId },
          },
        },
      },
    });

    const completedPersonalGrowth = personalGrowthEngagement.filter((item) => item.completed === true);

    const personalGrowthCompletedChallenges = completedPersonalGrowth.length;

    const personalGrowthAllChallenges = await this.userPersonalGrowthChallenges.count();

    return {
      personalGrowthAllChallenges,
      personalGrowthCompletedChallenges,
    };
  }

  async getPhysicalActivityPerformance(
    seniorId: number,
    caregiverId?: number,
  ): Promise<TResponse<TPhysicalActivityCompletedPercentage>> {
    const i18nContext = I18nContext.current();
    const lang = i18nContext?.lang || 'en';

    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate.setHours(23, 59, 59, 999);
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(23, 59, 59, 999);

    const userActivities = await this.userActivitiesRepository.findOne({
      where: {
        user: {
          id: seniorId,
          ...(caregiverId && { admins: { id: caregiverId } }),
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
      return createResponse(HttpStatus.NOT_FOUND, null, 'No user activities', '');
    }
    const exerciseStartDate = userActivities?.start_date;
    if (exerciseStartDate && exerciseStartDate > startDate) {
      startDate = new Date(exerciseStartDate);
      startDate.setDate(startDate.getDate());
      startDate.setHours(23, 59, 59, 999);
    }

    const {
      user_physical_exercises,
      user_breathing_exercises,
      user_walking_exercises,
      user_physical_activities_scores,
      physical_level,
      breathing_level,
    } = userActivities;

    const userAssessmentScore = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: { id: seniorId },
        },
      },
    });

    if (!userAssessmentScore) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'No user assessment score', '');
    }

    const userActivitiesGroup = userAssessmentScore.physical_activities_group;

    const physicalExercises = user_physical_exercises.map((el) => el.name);
    const breathingExercises = user_breathing_exercises.map((el) => el.name);
    const walkingExercises = user_walking_exercises ? EWalkingExercises.WALKING_EXERCISE : null;

    const dateRange = [];
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      dateRange.push(new Date(date));
    }

    let totalPhysicalExercisesToDo = 0;
    let totalBreathingExercisesToDo = 0;
    let totalWalkingExercisesToDo = 0;
    let totalPhysicalExercisesDone = 0;
    let totalBreathingExercisesDone = 0;
    let totalWalkingExercisesDone = 0;

    for (const date of dateRange) {
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      const isTargetDay3_1 = [1, 3, 5].includes(dayOfWeek);
      const isTargetDay3_2 = [2, 4, 6].includes(dayOfWeek);
      const isTargetDay5 = [1, 2, 3, 4, 5].includes(dayOfWeek);

      const dailyScores = user_physical_activities_scores.filter((score) => {
        const scoreDate = new Date(score.created_at);
        return scoreDate.toISOString().split('T')[0] === dateString;
      });

      if (userActivitiesGroup === EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES) {
        if (physical_level === EActivityLevel.INTENSE) {
          totalPhysicalExercisesToDo += physicalExercises.length * 2;
        } else {
          totalPhysicalExercisesToDo += physicalExercises.length;
        }
        if (breathing_level === EActivityLevel.INTENSE) {
          totalBreathingExercisesToDo += breathingExercises.length * 2;
        } else {
          totalBreathingExercisesToDo += breathingExercises.length;
        }
      } else if (userActivitiesGroup === EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES) {
        if (physical_level === EActivityLevel.LIGHT && isTargetDay3_2) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        } else if (physical_level === EActivityLevel.MODERATE && isTargetDay5) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        } else if (physical_level === EActivityLevel.INTENSE) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        }
        if (breathing_level === EActivityLevel.LIGHT && isTargetDay3_1) {
          totalBreathingExercisesToDo += breathingExercises.length;
        } else if (breathing_level === EActivityLevel.MODERATE && isTargetDay5) {
          totalBreathingExercisesToDo += breathingExercises.length;
        } else if (breathing_level === EActivityLevel.INTENSE) {
          totalBreathingExercisesToDo += breathingExercises.length;
        }
      } else if (userActivitiesGroup === EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES) {
        if (physical_level === EActivityLevel.LIGHT && isTargetDay3_2) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        } else if (physical_level === EActivityLevel.MODERATE && isTargetDay5) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        } else if (physical_level === EActivityLevel.INTENSE) {
          totalPhysicalExercisesToDo += physicalExercises.length;
        }
        if (breathing_level === EActivityLevel.LIGHT && isTargetDay3_1) {
          totalBreathingExercisesToDo += breathingExercises.length;
        } else if (breathing_level === EActivityLevel.MODERATE && isTargetDay5) {
          totalBreathingExercisesToDo += breathingExercises.length;
        } else if (breathing_level === EActivityLevel.INTENSE) {
          totalBreathingExercisesToDo += breathingExercises.length;
        }
        if (walkingExercises) {
          totalWalkingExercisesToDo += 1;
        }
      }

      totalPhysicalExercisesDone += dailyScores.filter((score) =>
        physicalExercises.includes(score.name as EPhysicalExercises),
      ).length;
      totalBreathingExercisesDone += dailyScores.filter((score) =>
        breathingExercises.includes(score.name as EBreathingExerciseType),
      ).length;
      totalWalkingExercisesDone += dailyScores.filter((score) => score.name === walkingExercises).length;
    }

    const totalExercisesDone = totalPhysicalExercisesDone + totalBreathingExercisesDone + totalWalkingExercisesDone;
    const totalExercisesToDo = totalPhysicalExercisesToDo + totalBreathingExercisesToDo + totalWalkingExercisesToDo;

    const physicalExercisesPercentage = totalPhysicalExercisesToDo
      ? Math.round((totalPhysicalExercisesDone / totalPhysicalExercisesToDo) * 100)
      : null;
    const breathingExercisesPercentage = totalBreathingExercisesToDo
      ? Math.round((totalBreathingExercisesDone / totalBreathingExercisesToDo) * 100)
      : null;
    const walkingExercisesPercentage = totalWalkingExercisesToDo
      ? Math.round((totalWalkingExercisesDone / totalWalkingExercisesToDo) * 100)
      : null;
    let overalPhysicalActivityPerformancePercentage = 0;
    const divisor = Object.values({ physicalExercisesPercentage, breathingExercisesPercentage }).filter(
      (val) => val != null,
    ).length;

    if (walkingExercises) {
      overalPhysicalActivityPerformancePercentage = totalExercisesToDo
        ? Math.round(
            (physicalExercisesPercentage + breathingExercisesPercentage + walkingExercisesPercentage) / (divisor + 1),
          )
        : 0;
    } else if (!walkingExercises) {
      overalPhysicalActivityPerformancePercentage = totalExercisesToDo
        ? Math.round((physicalExercisesPercentage + breathingExercisesPercentage) / divisor)
        : 0;
    }

    const percentage = {
      physicalExercisesPercentage: physicalExercisesPercentage,
      breathingExercisesPercentage: breathingExercisesPercentage,
      walkingExercisesPercentage: walkingExercisesPercentage,
      overalPhysicalActivityPerformancePercentage,
      totalExercisesToDo,
      totalExercisesDone,
    };

    return createResponse(
      HttpStatus.OK,
      { ...percentage },
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_PHYSICAL_ACTIVITY_PERFORMANCE.performance_fetched.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TDashboardsResponseKey}.service.GET_PHYSICAL_ACTIVITY_PERFORMANCE.performance_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }
}
