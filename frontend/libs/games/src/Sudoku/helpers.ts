import { type SolvedSudokuGrid, type SudokuGrid } from '@Procareful/common/lib';
import { ENGAGEMENT_POINTS, WIN_POINTS, ABORTED_WITHOUT_PLAYING_POINTS } from './constants';

const areSudokuBoardsDifferent = (board1: SudokuGrid, board2: SudokuGrid) => {
  if (board1.length !== board2.length) {
    return true;
  }

  for (let i = 0; i < board1.length; i++) {
    if (board1[i].length !== board2[i].length) {
      return true;
    }

    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) {
        return true;
      }
    }
  }

  return false;
};

export const getNumberOfPoints = (hasWon: boolean, initialBoard: SudokuGrid, board: SudokuGrid) => {
  if (hasWon) {
    return WIN_POINTS;
  }

  if (!areSudokuBoardsDifferent(initialBoard, board)) {
    return ABORTED_WITHOUT_PLAYING_POINTS;
  }

  return ENGAGEMENT_POINTS;
};

export const countNumbersInBoard = (board: SudokuGrid) =>
  board.flat().reduce(
    (accumulator, currentValue) => {
      if (currentValue) accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;

      return accumulator;
    },
    {} as Record<number, number>
  );

const isValid = (board: SudokuGrid, row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
};

const solveSudoku = (board: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = null;
          }
        }

        return false;
      }
    }
  }

  return true;
};

export const getSudokuSolution = (input: SudokuGrid): SolvedSudokuGrid | null => {
  const board = input.map(row => [...row]);

  return solveSudoku(board) ? (board as SolvedSudokuGrid) : null;
};
