import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { EDifficultyFeedback, EPersonalRate } from '../types';
import { EGame } from '../games/types';

export class AddGameFeedbackIncreasedDifficultyLevel {
  @IsEnum(EGame)
  game_name: EGame;

  @IsEnum(EPersonalRate)
  rating: EPersonalRate;

  @IsOptional()
  @IsArray()
  @IsEnum(EDifficultyFeedback, { each: true })
  feedback?: EDifficultyFeedback[];
}
