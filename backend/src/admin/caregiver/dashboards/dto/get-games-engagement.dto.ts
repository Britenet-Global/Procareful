import { EGame } from '../../../../user/games/types';
import { NestedPagination } from '../../../../common/dto';

class GameScoreDto {
  date: string;
  totalTime: number;
}
class GamesScoresPerUserDto {
  userId: string;
  firstName: string;
  lastName: string;
  userMostPlayedGame: EGame;
  userLeastPlayedGame: EGame;
  scores: GameScoreDto[];
  averageDailyTime: number;
}
export class GetGamesEngagementDto {
  averageDailyGameTime: number;
  mostPlayedGame: EGame;
  leastPlayedGame: EGame;
  gamesScores: {
    items: GamesScoresPerUserDto[];
    pagination: NestedPagination;
  };
}
