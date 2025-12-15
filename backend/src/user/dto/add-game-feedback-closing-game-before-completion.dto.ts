import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { EGame } from '../games/types';
import { EGameExperienceFeedback } from '../types';

export class AddGameFeedbackClosingGameBeforeCompletion {
  @IsEnum(EGame)
  game_name: EGame;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EGameExperienceFeedback, { each: true })
  feedback: EGameExperienceFeedback[];
}
