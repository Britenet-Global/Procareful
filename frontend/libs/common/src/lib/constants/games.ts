import { AddGameScoreDtoGameName } from '@Procareful/common/api';

export const GAME_NAME = {
  2048: '2048',
  Wordle: 'Wordle',
  Sudoku: 'Sudoku',
  TicTacToe: 'Tic Tac Toe',
  Snake: 'Snake',
  Memory: 'Memory',
  WordGuess: 'Word guess',
} as const;

export const GAME_NAME_FROM_BACKEND_FORMAT = {
  [AddGameScoreDtoGameName.game_2048]: GAME_NAME[2048],
  [AddGameScoreDtoGameName.memory]: GAME_NAME.Memory,
  [AddGameScoreDtoGameName.snake]: GAME_NAME.Snake,
  [AddGameScoreDtoGameName.sudoku]: GAME_NAME.Sudoku,
  [AddGameScoreDtoGameName.tic_tac_toe]: GAME_NAME.TicTacToe,
  [AddGameScoreDtoGameName.word_guess]: GAME_NAME.WordGuess,
  [AddGameScoreDtoGameName.wordle]: GAME_NAME.Wordle,
};
