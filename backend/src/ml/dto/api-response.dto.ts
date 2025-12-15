import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto';
import { EDifficultyLevel, EGame } from 'src/user/games/types';
import { GetRecentGameScoreDto } from '.';
import { Game2048, Memory, Snake, TicTacToe, Sudoku, WordGuess, Wordle } from 'src/user/games/entities';

export class BaseGetGameRulesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Game rules');
}

export class Game2048RulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: Game2048;
}

export class MemoryRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: Memory;
}

export class SnakeRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: Snake;
}

export class TicTacToeRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: TicTacToe;
}

export class SudokuRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: Sudoku;
}

export class WordGuessRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: WordGuess;
}

export class WordleRulesResponseDto extends BaseGetGameRulesResponseDto {
  @ApiProperty()
  details: Wordle;
}

export class GetGameDifficultyLevelsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto(`${EGame.GAME_2048} game difficulty levels`);

  details: EDifficultyLevel[];
}

export class GetRecentGameScoreResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Recent game scores');

  details: GetRecentGameScoreDto;
}

export class GetGamesListResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Games list fetched');

  details: EGame[];
}
