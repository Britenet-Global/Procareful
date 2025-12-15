import { Game2048, Memory, Snake, TicTacToe, Sudoku, WordGuess, Wordle } from '../entities';

export enum EDifficultyLevel {
  EASY = 1,
  EASY_PLUS = 2,
  MEDIUM = 3,
  MEDIUM_PLUS = 4,
  HARD = 5,
  HARD_PLUS = 6,
}

export enum EGame {
  GAME_2048 = 'game_2048',
  MEMORY = 'memory',
  SNAKE = 'snake',
  SUDOKU = 'sudoku',
  TIC_TAC_TOE = 'tic_tac_toe',
  WORD_GUESS = 'word_guess',
  WORDLE = 'wordle',
}

export type TGameEntityType = Game2048 | Memory | Snake | TicTacToe | Sudoku | WordGuess | Wordle;

export enum EScoreViewer {
  INSTITUTION = 'institution',
  CAREGIVER = 'caregiver',
}
