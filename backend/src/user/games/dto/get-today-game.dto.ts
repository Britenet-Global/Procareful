import { EDifficultyLevel, EGame } from '../types';

export class GetTodayGameDto {
  todayGameName: EGame;
  level: EDifficultyLevel;
  completed: boolean;
}
