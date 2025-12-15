import flattenDeep from 'lodash/flattenDeep';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import { create } from 'zustand';
import { GameDisplayState } from '@Procareful/games';
import {
  checkIsFinalScoreReached,
  checkMoves,
  createBoard,
  setProperScoreToSend,
} from '../helpers';
import type { GameState, TileMap, TileProps as Tile, GameConfig } from '../types';

type Game2048Store = {
  gameState: GameState;
  gameConfig: GameConfig;
  setBoard: (tileCount: number) => void;
  cleanUp: () => void;
  createTile: (newTile: Omit<Tile, 'id'>) => void;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  setConfig: (level: number, tileCount: number, startingNumber: number) => void;
  setGameFinished: (isFinished: boolean) => void;
  resetGame: () => void;
  showTutorial: boolean;
  setShowTutorial: (showTutorial: boolean) => void;
  showTutorialModal: boolean;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  gameDisplayState: GameDisplayState;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
};

const initialState = {
  gameState: {
    board: [],
    tiles: {},
    tilesByIds: [],
    hasChanged: false,
    score: 0,
    scoredValues: new Set<number>(),
    level: undefined,
    status: {
      isStarted: false,
      isFinished: false,
      isOver: false,
      isWon: false,
    },
  },
  gameConfig: { totalCellsCount: 36, tileCount: 6, startingNumber: 2 },
  showTutorial: true,
  showTutorialModal: false,
  gameDisplayState: GameDisplayState.PLAYING,
};

export const useGame2048Store = create<Game2048Store>(set => ({
  ...initialState,
  setBoard: tileCount =>
    set(({ gameState }) => ({ gameState: { ...gameState, board: createBoard(tileCount) } })),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
  setGameDisplayState: gameDisplayState => set({ gameDisplayState }),
  cleanUp: () =>
    set(({ gameState }) => {
      const flattenBoard = flattenDeep(gameState.board);
      const newTiles: TileMap = flattenBoard.reduce((result, tileId: string) => {
        if (isNil(tileId)) {
          return result;
        }

        return {
          ...result,
          [tileId]: gameState.tiles[tileId],
        };
      }, {});

      const updatedGameState = {
        ...gameState,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
        hasChanged: false,
      };

      return {
        gameState: updatedGameState,
      };
    }),
  createTile: newTile =>
    set(({ gameState }) => {
      const tileId = crypto.randomUUID();
      const [x, y] = newTile.position;
      const newBoard = JSON.parse(JSON.stringify(gameState.board));
      if (!newBoard.length) {
        return { gameState };
      }
      newBoard[y][x] = tileId;
      const updatedTiles = { ...gameState.tiles, [tileId]: { id: tileId, ...newTile } };

      const isWon = checkIsFinalScoreReached(gameState.tiles);

      const updatedGameState = {
        ...gameState,
        board: newBoard,
        tiles: updatedTiles,
        tilesByIds: [...gameState.tilesByIds, tileId],
        status: {
          ...gameState.status,
          isWon,
        },
      };

      const hasUserMoves = checkMoves(newBoard, updatedTiles);

      if (!hasUserMoves && gameState.status.isStarted) {
        return {
          gameState: {
            ...updatedGameState,
            status: { ...gameState.status, isOver: true },
          },
        };
      }

      return {
        gameState: updatedGameState,
      };
    }),
  moveUp: () =>
    set(({ gameState, gameConfig }) => {
      const tileCount = gameConfig.tileCount;
      const newBoard = createBoard(tileCount);
      const newTiles: TileMap = {};
      let hasChanged = false;
      const { board, tiles } = gameState;

      for (let x = 0; x < tileCount; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCount; y++) {
          const tileId = board[y][x];
          const currentTile = tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY++;
          }
        }
      }

      const updatedScore = setProperScoreToSend(newTiles, gameState.scoredValues) + gameState.score;

      const updatedGameState = {
        ...gameState,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score: updatedScore,
      };

      return {
        gameState: updatedGameState,
      };
    }),
  moveDown: () =>
    set(({ gameState, gameConfig }) => {
      const tileCount = gameConfig.tileCount;
      const newBoard = createBoard(tileCount);
      const newTiles: TileMap = {};
      let hasChanged = false;

      for (let x = 0; x < tileCount; x++) {
        let newY = tileCount - 1;
        let previousTile: Tile | undefined;

        for (let y = tileCount - 1; y >= 0; y--) {
          const tileId = gameState.board[y][x];
          const currentTile = gameState.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY--;
          }
        }
      }

      const updatedScore = setProperScoreToSend(newTiles, gameState.scoredValues) + gameState.score;

      const updatedGameState = {
        ...gameState,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score: updatedScore,
      };

      return {
        gameState: updatedGameState,
      };
    }),
  moveLeft: () =>
    set(({ gameState, gameConfig }) => {
      const tileCount = gameConfig.tileCount;
      const newBoard = createBoard(tileCount);
      const newTiles: TileMap = {};
      let hasChanged = false;

      for (let y = 0; y < tileCount; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCount; x++) {
          const tileId = gameState.board[y][x];
          const currentTile = gameState.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX++;
          }
        }
      }

      const updatedScore = setProperScoreToSend(newTiles, gameState.scoredValues) + gameState.score;

      const updatedGameState = {
        ...gameState,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score: updatedScore,
      };

      return {
        gameState: updatedGameState,
      };
    }),
  moveRight: () =>
    set(({ gameState, gameConfig }) => {
      const tileCount = gameConfig.tileCount;
      const newBoard = createBoard(tileCount);
      const newTiles: TileMap = {};
      let hasChanged = false;

      for (let y = 0; y < tileCount; y++) {
        let newX = tileCount - 1;
        let previousTile: Tile | undefined;

        for (let x = tileCount - 1; x >= 0; x--) {
          const tileId = gameState.board[y][x];
          const currentTile = gameState.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...gameState.tiles[tileId],
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX--;
          }
        }
      }

      const updatedScore = setProperScoreToSend(newTiles, gameState.scoredValues) + gameState.score;

      const updatedGameState = {
        ...gameState,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score: updatedScore,
      };

      return {
        gameState: updatedGameState,
      };
    }),
  setConfig: (level, tileCount, startingNumber) =>
    set(({ gameState }) => ({
      gameState: { ...gameState, level, status: { ...gameState.status, isStarted: true } },
      gameConfig: { totalCellsCount: tileCount * tileCount, tileCount, startingNumber },
    })),
  setGameFinished: isFinished =>
    set(({ gameState }) => ({
      gameState: { ...gameState, status: { ...gameState.status, isFinished } },
    })),
  resetGame: () => set({ ...initialState }),
}));
