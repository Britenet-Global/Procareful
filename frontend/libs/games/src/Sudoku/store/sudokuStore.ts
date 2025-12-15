import { create } from 'zustand';
import { type SudokuGrid, type SolvedSudokuGrid } from '@Procareful/common/lib';
import { GameDisplayState } from '@Procareful/games';

const BOARD_INITIAL_STATE = [[], [], [], [], [], [], [], [], []];

type SudokuStore = {
  board: SudokuGrid;
  initialBoard: SudokuGrid;
  solution: SolvedSudokuGrid;
  selectedCell: { row: number; col: number } | null;
  showModal: boolean;
  isValidSudoku: boolean;
  gameFinished: boolean;
  showTutorial: boolean;
  showTutorialModal: boolean;
  showSolutionModal: boolean;
  gameDisplayState: GameDisplayState;
  setBoard: (board: SudokuGrid) => void;
  setInitialBoard: (initialBoard: SudokuGrid) => void;
  setSolution: (solution: SolvedSudokuGrid) => void;
  setSelectedCell: (selectedCell: { row: number; col: number } | null) => void;
  setGameFinished: (gameFinished: boolean) => void;
  setShowTutorial: (showTutorial: boolean) => void;
  setShowModal: (showModal: boolean) => void;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  setShowSolutionModal: (showSolutionModal: boolean) => void;
  setIsValidSudoku: (isValidSudoku: boolean) => void;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
  clearState: () => void;
};

const initialState = {
  board: BOARD_INITIAL_STATE,
  initialBoard: BOARD_INITIAL_STATE,
  solution: BOARD_INITIAL_STATE,
  gameDisplayState: GameDisplayState.PLAYING,
  selectedCell: null,
  showModal: false,
  isValidSudoku: false,
  gameFinished: false,
  showTutorial: true,
  showTutorialModal: false,
  showSolutionModal: false,
};

export const useSudokuStore = create<SudokuStore>(set => ({
  ...initialState,
  setBoard: board => set({ board }),
  setInitialBoard: initialBoard => set({ initialBoard }),
  setSolution: solution => set({ solution }),
  setSelectedCell: selectedCell => set({ selectedCell }),
  setShowModal: showModal => set({ showModal }),
  setGameFinished: gameFinished => set({ gameFinished }),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
  setShowSolutionModal: showSolutionModal => set({ showSolutionModal }),
  setIsValidSudoku: isValidSudoku => set({ isValidSudoku }),
  setGameDisplayState: gameDisplayState => set({ gameDisplayState }),
  clearState: () => set({ ...initialState }),
}));
