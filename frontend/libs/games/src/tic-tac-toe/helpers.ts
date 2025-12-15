import { NoOneWon, PlayerFigure } from './constants';

export type Winner = PlayerFigure | NoOneWon;

export type Win = { isWon: boolean | null | NoOneWon.Draw };

export type Player = Winner | string | null;

export type Board = Player[][];

export type GameSettings = {
  boardSize: number;
  winningLength: number;
  numberOfGames: number;
  numberOfGamesToWin: number;
  aiDepth: number;
};

type AIMove = [number, number][];

export const emptyBoard = (size: number): Board =>
  Array.from({ length: size }, () => Array(size).fill(null));

export const generateNumOfGames = (numOfGames: number): Win[] =>
  Array(numOfGames).fill({
    isWon: null,
  });

export const handleAIMove = (
  board: Board,
  playerFigure: PlayerFigure,
  winningLength: number
): [number, number] => {
  const move: AIMove = [];

  board.forEach((row, rowIndex) =>
    row.forEach((_, colIndex) => {
      if (!board[rowIndex][colIndex]) {
        const newBoard = board.map(figure => [...figure]);
        newBoard[rowIndex][colIndex] = playerFigure;
        if (checkWinner(newBoard, winningLength).winner === playerFigure) {
          const randomnessFactor = Math.random() < 0.5;

          if (randomnessFactor) {
            move.unshift([rowIndex, colIndex]);
          }

          return randomnessFactor;
        }
      }
    })
  );

  const opponent = playerFigure === 'X' ? 'O' : 'X';

  board.some((row, rowIndex) =>
    row.some((_, colIndex) => {
      if (!board[rowIndex][colIndex]) {
        const newBoard = board.map(figure => [...figure]);
        newBoard[rowIndex][colIndex] = opponent;
        if (checkWinner(newBoard, winningLength).winner === opponent) {
          move.push([rowIndex, colIndex]);

          return true;
        }
      }

      return false;
    })
  );

  if (move.length > 0) {
    return move[0];
  }

  if (!board[1][1]) {
    return [1, 1];
  }

  const emptyCells: AIMove = [];
  board.forEach((row, rowIndex) =>
    row.forEach((_, colIndex) => {
      if (!board[rowIndex][colIndex]) {
        emptyCells.push([rowIndex, colIndex]);
      }
    })
  );

  const randomCell = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomCell];
};

export const checkWinner = (board: Board, winningLength: number) => {
  const size = board.length;
  const symbols = [PlayerFigure.Cross, PlayerFigure.Circle];

  for (const symbol of symbols) {
    // Check rows
    for (let i = 0; i < size; i++) {
      let count = 0;
      for (let j = 0; j < size; j++) {
        if (board[i][j] === symbol) {
          count++;
          if (count === winningLength) {
            const winningCells: string[] = [];
            for (let p = 0; p < winningLength; p++) {
              winningCells.push(`${i}-${j - winningLength + 1 + p}`);
            }

            return { winner: symbol, winningCells };
          }
        } else {
          count = 0;
        }
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      let count = 0;
      for (let j = 0; j < size; j++) {
        if (board[j][i] === symbol) {
          count++;
          if (count === winningLength) {
            const winningCells: string[] = [];
            for (let p = 0; p < winningLength; p++) {
              winningCells.push(`${j - winningLength + 1 + p}-${i}`);
            }

            return { winner: symbol, winningCells };
          }
        } else {
          count = 0;
        }
      }
    }

    // Check diagonals (left to right)
    for (let i = 0; i <= size - winningLength; i++) {
      for (let j = 0; j <= size - winningLength; j++) {
        let count = 0;
        for (let k = 0; k < winningLength; k++) {
          if (board[i + k][j + k] === symbol) {
            count++;
            if (count === winningLength) {
              const winningCells: string[] = [];
              for (let p = 0; p < winningLength; p++) {
                winningCells.push(`${i + p}-${j + p}`);
              }

              return { winner: symbol, winningCells };
            }
          } else {
            break;
          }
        }
      }
    }

    // Check diagonals (right to left)
    for (let i = 0; i <= size - winningLength; i++) {
      for (let j = size - 1; j >= winningLength - 1; j--) {
        let count = 0;
        for (let k = 0; k < winningLength; k++) {
          if (board[i + k][j - k] === symbol) {
            count++;
            if (count === winningLength) {
              const winningCells: string[] = [];
              for (let p = 0; p < winningLength; p++) {
                winningCells.push(`${i + p}-${j - p}`);
              }

              return { winner: symbol, winningCells };
            }
          } else {
            break;
          }
        }
      }
    }
  }

  const allFilled = board.flat().every(element => element !== null);

  if (allFilled) {
    return { winner: NoOneWon.Draw, winningCells: [] };
  }

  // No winner
  return { winner: null, winningCells: [] };
};
