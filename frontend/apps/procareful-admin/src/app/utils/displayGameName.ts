import {
  type GamesScoresPerUserDtoUserLeastPlayedGame,
  type GamesScoresPerUserDtoUserMostPlayedGame,
  type GetGamesEngagementDtoLeastPlayedGame,
  GetGamesEngagementDtoMostPlayedGame,
} from '@Procareful/common/api';
import { GAME_NAME } from '@Procareful/common/lib/constants';

export const displayGameName = (
  gameName:
    | GetGamesEngagementDtoMostPlayedGame
    | GetGamesEngagementDtoLeastPlayedGame
    | GamesScoresPerUserDtoUserLeastPlayedGame
    | GamesScoresPerUserDtoUserMostPlayedGame
) => {
  switch (gameName) {
    case GetGamesEngagementDtoMostPlayedGame.game_2048:
      return GAME_NAME[2048];
    case GetGamesEngagementDtoMostPlayedGame.memory:
      return GAME_NAME.Memory;
    case GetGamesEngagementDtoMostPlayedGame.snake:
      return GAME_NAME.Snake;
    case GetGamesEngagementDtoMostPlayedGame.sudoku:
      return GAME_NAME.Sudoku;
    case GetGamesEngagementDtoMostPlayedGame.tic_tac_toe:
      return GAME_NAME.TicTacToe;
    case GetGamesEngagementDtoMostPlayedGame.word_guess:
      return GAME_NAME.WordGuess;
    case GetGamesEngagementDtoMostPlayedGame.wordle:
      return GAME_NAME.Wordle;
  }
};
