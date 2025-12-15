import { type GameState, type TileMap, type TileProps } from './types';

// helper function
export const createBoard = (tileCount?: number) => {
  const board: string[][] = [];

  if (!tileCount) {
    return board;
  }

  for (let i = 0; i < tileCount; i += 1) {
    board[i] = new Array(tileCount).fill(undefined);
  }

  return board;
};

export const checkIsFinalScoreReached = (tiles: TileMap) =>
  (Object.values(tiles) as TileProps[]).some(tile => tile.value === 2048);

export const checkMoves = (board: GameState['board'], tiles: GameState['tiles']): boolean => {
  // Check for empty cells
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) {
        return true; // If there's an empty cell, there's a move available
      }
    }
  }

  // Check for adjacent cells with same value
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const currentCellId = board[i][j];
      const currentCell = tiles[currentCellId];

      if (!currentCell || !board.length) {
        return true;
      }

      // Check if the cell has a neighbor in any direction
      if (
        (i > 0 && tiles[board[i - 1][j]] && tiles[board[i - 1][j]].value === currentCell.value) ||
        (i < board.length - 1 &&
          tiles[board[i + 1][j]] &&
          tiles[board[i + 1][j]].value === currentCell.value) ||
        (j > 0 && tiles[board[i][j - 1]] && tiles[board[i][j - 1]].value === currentCell.value) ||
        (j < board[0].length - 1 &&
          tiles[board[i][j + 1]] &&
          tiles[board[i][j + 1]].value === currentCell.value)
      ) {
        return true; // If there's a neighboring cell with the same value, there's a move available
      }
    }
  }

  return false; // No empty cells and no adjacent cells with the same value, no moves available
};

export const setProperScoreToSend = (tiles: GameState['tiles'], scoredValues: Set<number>) => {
  const tilesValues = Object.values(tiles).map(tile => tile.value);
  const maxTileValue = Math.max(...tilesValues);

  const targetValues = [128, 256, 512, 1024, 2048];

  if (!targetValues.includes(maxTileValue) || scoredValues.has(maxTileValue)) {
    return 0;
  }

  scoredValues.add(maxTileValue);

  switch (maxTileValue) {
    case 128:
      return 25;
    case 256:
      return 50;
    case 512:
      return 75;
    case 1024:
      return 100;
    case 2048:
      return 125;
    default:
      return 0;
  }
};
