import { type SudokuGrid } from '@Procareful/common/lib';
import {
  BOARD_SIZE,
  FIRST_GROUP,
  LAST_GROUP,
  MATCHING_PAIR,
  MAX_ROTATIONS,
  MAX_TRANSFORMATIONS,
} from '../constants';

type ColumnMap = { [key: number]: number };

const rotateBoard = (board: SudokuGrid) => {
  const numberOfRotations = Math.floor(Math.random() * MAX_ROTATIONS);

  const rotate = (board: SudokuGrid) =>
    board.map((row, rowIndex) =>
      row.map((_, colIndex) => board[board.length - 1 - colIndex][rowIndex])
    );

  const applyRotations = (board: SudokuGrid, rotations: number): SudokuGrid =>
    rotations === 0 ? board : applyRotations(rotate(board), rotations - 1);

  const rotatedBoard = applyRotations(board, numberOfRotations);

  return rotatedBoard;
};

const mirroringBoard = (board: SudokuGrid) => {
  const numberOfTransformation = Math.floor(Math.random() * MAX_TRANSFORMATIONS);

  const rotateVertically = (board: SudokuGrid) => board.map(row => row.slice().reverse());

  const rotateHorizontally = (board: SudokuGrid) => board.slice().reverse();

  switch (numberOfTransformation) {
    case 0:
      return board;
    case 1:
      return rotateVertically(board);
    case 2:
      return rotateHorizontally(board);
    default:
      return board;
  }
};

const changeRows = (board: SudokuGrid) => {
  const generateRandomArrayRow = () => {
    const shuffleArray = (array: number[]) =>
      array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffleArray(FIRST_GROUP);
  };

  const newRowsFirstGroup = generateRandomArrayRow();
  const newRowsSecondGroup = newRowsFirstGroup.map(num => BOARD_SIZE - 1 - num).reverse();

  const result = [...board];

  const updatedValues = FIRST_GROUP.flatMap(i => [
    { index: i, value: board[newRowsFirstGroup[i]] },
    { index: i + MATCHING_PAIR, value: board[newRowsSecondGroup[i]] },
  ]);

  updatedValues.forEach(({ index, value }) => {
    result[index] = value;
  });

  return result;
};

const swapMiddleRows = (board: SudokuGrid) => {
  const randomValue = Math.floor(Math.random() * 2);
  const newBoard = [...board];

  if (randomValue === 0) {
    const temp = newBoard[3];
    newBoard[3] = newBoard[5];
    newBoard[5] = temp;
  }

  return newBoard;
};

const changeColumns = (board: SudokuGrid) => {
  const generateRandomArray = () => {
    const shuffleArray = (array: number[]) =>
      array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffleArray(FIRST_GROUP);
  };

  const newColumnsFirstGroup = generateRandomArray();
  const newColumnsSecondGroup = newColumnsFirstGroup.map(num => BOARD_SIZE - 1 - num).reverse();

  const swapColumns = (board: SudokuGrid, colMap: ColumnMap): SudokuGrid =>
    board.map(row =>
      row.map((value, colIndex) => (colMap[colIndex] !== undefined ? row[colMap[colIndex]] : value))
    );

  const colMap1: ColumnMap = FIRST_GROUP.reduce((map, index) => {
    map[index] = newColumnsFirstGroup[index];

    return map;
  }, {} as ColumnMap);

  const colMap2: ColumnMap = LAST_GROUP.reduce((map, index) => {
    map[index] = newColumnsSecondGroup[index - MATCHING_PAIR];

    return map;
  }, {} as ColumnMap);

  const colMap: ColumnMap = { ...colMap1, ...colMap2 };

  const boardAfterSwap: SudokuGrid = swapColumns(board, colMap);

  return boardAfterSwap;
};

const swapMiddleColumns = (board: SudokuGrid) => {
  const swapColumns = (board: SudokuGrid, col1: number, col2: number) =>
    board.map(row => {
      const newRow = [...row];
      [newRow[col1], newRow[col2]] = [newRow[col2], newRow[col1]];

      return newRow;
    });

  const randomValue = Math.floor(Math.random() * 2);
  const newBoard = randomValue === 1 ? swapColumns(board, 3, 5) : board;

  return newBoard;
};

export const generateBoard = (board: SudokuGrid) => {
  const rotatedBoard = rotateBoard(board);

  const mirroredBoard = mirroringBoard(rotatedBoard);

  const changeRowsBoard = changeRows(mirroredBoard);

  const changeMiddleRowsBoard = swapMiddleRows(changeRowsBoard);

  const changeColumnsBoard = changeColumns(changeMiddleRowsBoard);

  const changeMiddleColumnsBoard = swapMiddleColumns(changeColumnsBoard);

  const result = changeMiddleColumnsBoard;

  return result;
};
