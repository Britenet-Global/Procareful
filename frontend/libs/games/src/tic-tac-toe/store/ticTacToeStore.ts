import { create } from 'zustand';
import { GameDisplayState, GameResult, type Round } from '@Procareful/games';
import {
  aiDepth,
  GameLevel,
  NoOneWon,
  PlayerFigure,
  POINTS_EARN_WHEN_DRAW,
  POINTS_EARN_WHEN_LOSE,
  POINTS_EARN_WHEN_WIN,
} from '../constants';
import {
  type Board,
  type GameSettings,
  type Winner,
  type Win,
  emptyBoard,
  generateNumOfGames,
} from '../helpers';

type TicTacToeStore = {
  gameConfig: GameSettings;
  isGameStarted: boolean;
  isGameOver: boolean;
  isPlayerTurn: boolean;
  gameLevel: GameLevel;
  board: Board;
  currentGame: number;
  progress: Round[];
  score: Win[];
  points: number;
  currentGamePoints: number;
  setPlayerPoints: (wonPoints: number) => void;
  setCurrentGamePoints: (wonPoints: number) => void;
  currentRound: number;
  playerFigure: PlayerFigure;
  aiFigure: PlayerFigure;
  winner: Winner | null;
  setWinner: (winner: Winner) => void;
  setGameConfig: (gameConfig: GameSettings) => void;
  setPlayerScore: (winnerFigure: Winner) => void;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
  startGame: (
    gameLevel: GameLevel,
    boardSize: number,
    winningLength: number,
    numberOfGames: number,
    numberOfGamesToWin: number,
    handleDrawFigure: () => void
  ) => void;
  resetBoard: (boardSize: number) => void;
  setUpdatedBoard: (board: Board) => void;
  setProgress: (winner: string | null) => void;
  setIsGameStarted: (isGameStarted: boolean) => void;
  clearState: () => void;
  setPlayersFigure: (playerFigure: PlayerFigure, aiFigure: PlayerFigure) => void;
  showTutorial: boolean;
  showTutorialModal: boolean;
  setShowTutorial: (showTutorial: boolean) => void;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  gameDisplayState: GameDisplayState;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
  winningCells: string[];
  setWinningCells: (winningCells: string[]) => void;
};

const initialGameConfig: GameSettings = {
  boardSize: 0,
  winningLength: 0,
  numberOfGames: 0,
  numberOfGamesToWin: 0,
  aiDepth: 0,
};

const initialState = {
  gameConfig: initialGameConfig,
  isGameStarted: false,
  isGameOver: false,
  isPlayerTurn: false,
  gameLevel: GameLevel.Easy,
  board: [],
  currentGame: 1,
  progress: [],
  score: [],
  points: 0,
  currentGamePoints: 0,
  currentRound: 0,
  playerFigure: PlayerFigure.Circle,
  aiFigure: PlayerFigure.Cross,
  winner: null,
  showTutorial: true,
  showTutorialModal: false,
  gameDisplayState: GameDisplayState.PLAYING,
  winningCells: [],
};

const userWinRound = { isWon: true };
const userLoseRound = { isWon: false };

export const useTicTacToeStore = create<TicTacToeStore>(set => ({
  ...initialState,
  setGameConfig: gameConfig => set({ gameConfig }),
  setPlayerScore: winnerFigure =>
    set(({ playerFigure, currentRound, score, setPlayerPoints, setCurrentGamePoints }) => {
      const isPlayerWinner = winnerFigure === playerFigure;
      const isAIWinner =
        winnerFigure && winnerFigure !== playerFigure && winnerFigure !== NoOneWon.Draw;
      const isDraw = winnerFigure === NoOneWon.Draw;

      const newUserScore = [...score].map((item, index) => {
        if (index === currentRound && winnerFigure !== null && winnerFigure !== NoOneWon.Draw) {
          return isPlayerWinner ? userWinRound : userLoseRound;
        }

        if (index === currentRound && winnerFigure === NoOneWon.Draw) {
          return { isWon: NoOneWon.Draw };
        }

        return item;
      });
      if (isPlayerWinner) {
        setPlayerPoints(POINTS_EARN_WHEN_WIN);
        setCurrentGamePoints(POINTS_EARN_WHEN_WIN);
      }

      if (isDraw) {
        setPlayerPoints(POINTS_EARN_WHEN_DRAW);
        setCurrentGamePoints(POINTS_EARN_WHEN_DRAW);
      }

      if (isAIWinner) {
        setPlayerPoints(POINTS_EARN_WHEN_LOSE);
        setCurrentGamePoints(POINTS_EARN_WHEN_LOSE);
      }

      return { score: newUserScore };
    }),
  setIsPlayerTurn: isPlayerTurn => set({ isPlayerTurn }),
  startGame: (
    gameLevel,
    boardSize,
    winningLength,
    numberOfGames,
    numberOfGamesToWin,
    handleDrawFigure
  ) =>
    set(() => {
      const board = emptyBoard(boardSize);
      handleDrawFigure();

      const progress = Array.from({ length: numberOfGames }, (_, index) => ({
        id: index + 1,
        status: null,
      }));

      return {
        isGameStarted: true,
        gameConfig: {
          boardSize,
          winningLength,
          numberOfGames,
          numberOfGamesToWin,
          aiDepth: aiDepth[gameLevel],
        },
        gameLevel,
        board,
        score: generateNumOfGames(numberOfGames),
        progress,
      };
    }),
  resetBoard: (boardSize: number) =>
    set(() => {
      const board = emptyBoard(boardSize);

      return { board, isGameOver: false, winner: null };
    }),
  setUpdatedBoard: board => set({ board }),
  setIsGameStarted: isGameStarted => set({ isGameStarted }),
  clearState: () => set({ ...initialState }),
  setPlayersFigure: (playerFigure, aiFigure) => {
    const isPlayerTurn = playerFigure === PlayerFigure.Cross;

    set({ isPlayerTurn, playerFigure, aiFigure });
  },
  setWinner: winner =>
    set(({ currentRound }) => ({ isGameOver: true, winner, currentRound: currentRound + 1 })),
  setPlayerPoints: (wonPoints: number) => set(({ points }) => ({ points: points + wonPoints })),
  setCurrentGamePoints: (wonPoints: number) => set(() => ({ currentGamePoints: wonPoints })),
  setProgress: (winner: string | null) =>
    set(({ playerFigure, progress, currentRound }) => {
      const isPlayerWinner = winner === playerFigure;
      const isAIWinner = winner && winner !== playerFigure && winner !== NoOneWon.Draw;
      const isDraw = winner === NoOneWon.Draw;

      const checkWinner = () => {
        if (isPlayerWinner) {
          return GameResult.WON;
        }

        if (isDraw) {
          return GameResult.DRAW;
        }

        if (isAIWinner) {
          return GameResult.LOST;
        }
      };

      const updatedProgress = progress.map((item: Round) =>
        item.id === currentRound ? { ...item, status: checkWinner() } : item
      );

      return { progress: updatedProgress };
    }),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
  setGameDisplayState: gameDisplayState => set({ gameDisplayState }),
  setWinningCells: winningCells => set({ winningCells }),
}));
