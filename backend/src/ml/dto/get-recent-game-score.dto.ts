import { EDifficultyLevel, EGame } from '../../user/games/types';

export class GetRecentGameScoreDto {
  id: number;
  created_at: Date;
  completion_time: number;
  number_of_tries?: number;
  number_of_hints_used?: number;
  score: number;
  number_of_wins?: number;
  snake_length?: number;
  number_of_hearts_used?: number;
  completed: boolean;
  game_name: EGame;
  game_level: EDifficultyLevel;
}
