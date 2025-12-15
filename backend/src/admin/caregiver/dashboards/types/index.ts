import { User } from '../../../../user/entities/user.entity';

import { ECaregiverRole } from '../../types';
import { NestedPaginatedResponseDto } from '../../../../common/dto';

export type TGroupedResults = {
  [userId: number]: {
    firstName: string;
    lastName: string;
    dates: {
      [date: string]: number;
    };
    games: {
      [game_name: string]: number;
    };
    daysCount: number;
  };
};

export type TGamesScoresPerUser = {
  userId: number;
  scores: {
    date: string;
    totalTime: number;
  }[];
  averageDailyTime: number;
};

export type TGetGamesEngagement = {
  averageDailyGameTime: number;
  mostPlayedGame: string[];
  leastPlayedGame: string[];
  gamesScores: NestedPaginatedResponseDto<TGamesScoresPerUser>;
};

export type DashboardInstitutionView = {
  seniors: number;
  informalCaregivers: number;
  formalCaregivers: number;
  rolesDistribution: Record<ECaregiverRole, number>;
  caregiversWorkload: {
    id: number;
    seniorCount: number;
    imageName: string;
    name: string;
    image: string | null;
  }[];
};

export type TUserActivity = {
  id: number;
  avatar: string;
  fullName: string;
  completionRate: number;
};

export interface IUserRetrievalStrategy {
  retrieveUsers(adminId: number): Promise<User[]>;
}

export type TSeniorsPerformance = {
  cognitiveGames: number;
  physicalActivity: number;
  personalGrowth: TPersonalGrowthPerformance | null;
  totalPerformance: number;
  assignedCarePlan: boolean;
};

export type TPersonalGrowthPerformance = {
  personalGrowthAllChallenges: number;
  personalGrowthCompletedChallenges: number;
};
