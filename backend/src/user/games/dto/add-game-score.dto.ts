import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { EDifficultyLevel, EGame } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

class BaseGameScoreDto {
  @IsEnum(EGame, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'game_name' }),
  })
  game_name: EGame;

  @IsEnum(EDifficultyLevel, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'game_level' }),
  })
  game_level: EDifficultyLevel;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'completion_time' }),
  })
  completion_time?: number;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'completed' }),
  })
  completed?: boolean;
}

class Game2048ScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'score' }),
  })
  score?: number;
}

class MemoryScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_tries' }),
  })
  number_of_tries?: number;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_hints_used' }),
  })
  number_of_hints_used?: number;
}

class SnakeScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'snake_length' }),
  })
  snake_length?: number;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_hearts_used' }),
  })
  number_of_hearts_used?: number;
}

class SudokuScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_hints_used' }),
  })
  number_of_hints_used?: number;
}

class TicTacToeScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_wins' }),
  })
  number_of_wins?: number;
}

class WordleScoresDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_hints_used' }),
  })
  number_of_hints_used?: number;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_tries' }),
  })
  number_of_tries?: number;
}

class WordGuess {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'number_of_hints_used' }),
  })
  number_of_hints_used?: number;
}

export class AddGameScoreDto extends BaseGameScoreDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Game2048ScoresDto)
  game_2048?: Game2048ScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MemoryScoresDto)
  memory?: MemoryScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SnakeScoresDto)
  snake?: SnakeScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SudokuScoresDto)
  sudoku?: SudokuScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TicTacToeScoresDto)
  tic_tac_toe?: TicTacToeScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WordleScoresDto)
  wordle?: WordleScoresDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WordGuess)
  word_guess?: WordGuess;
}
