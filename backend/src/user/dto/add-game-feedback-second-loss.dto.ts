import { ArrayNotEmpty, IsEnum } from 'class-validator';
import { EGameExperienceFeedback } from '../types';
import { IsNotEnumValues } from '../../common/decorators';
import { EGame } from '../games/types';

export class AddGameFeedbackAfterSecondLoss {
  @IsEnum(EGame)
  game_name: EGame;

  @ArrayNotEmpty()
  @IsNotEnumValues(EGameExperienceFeedback, [EGameExperienceFeedback.PREFER_OTHER_GAMES])
  feedback: EGameExperienceFeedback[];
}
